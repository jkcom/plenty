import { postMutations } from "api/src/client";
import type { AccountSelectType, UserSelectType } from "db";
import { createContext, useContext, useEffect, useState } from "react";
import { applyMutations } from "./apply-mutations";
import {
  mutationsFromCreate,
  update as mutationsFromUpdate,
  type Mutation,
} from "./mutations";
import type { SyncStore } from "./pool-store";
import type {
  Create,
  LcAccount,
  LcUser,
  Pool,
  PoolItem,
  Update,
} from "./types";
import { useMutationPoll } from "./use-mutation-poll";

type PlentyData = {
  account: LcAccount;
  user: LcUser;
};

export interface SyncContextType {
  data: PlentyData;
  pool: Pool;
  reRender?: () => void;
  addToPool?: (item: PoolItem) => void;
  mutate: (mutations: Mutation[]) => void;
  accountId: string;
  userId: string;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  store: SyncStore;
  user: UserSelectType;
  account: AccountSelectType;
  children: React.ReactNode;
  accessToken: string;
}

export const SyncProvider = (props: SyncProviderProps) => {
  const [poolHydrated, setPoolHydrated] = useState(false);
  const { pushPendingMutations } = useMutationPoll(props.store);

  const user: LcUser = {
    ref: {},
    col: { posts: [] },
    model: "user",
    ownerId: null,
    accountId: null,
    ...props.user,
  };
  const account: LcAccount = {
    ref: { owner: user },
    col: { posts: [] },
    accountId: null,
    model: "account",
    ...props.account,
  };

  const [data, setData] = useState<PlentyData>({ account, user });
  const [pool, setPool] = useState<Pool>([account, user]);

  // Listing to pushPendingMutations
  useEffect(() => {
    if (pushPendingMutations.length > 0) {
      (async () => {
        try {
          await postMutations(props.accessToken, pushPendingMutations);
          props.store.updateMutations(
            pushPendingMutations.map((m) => ({ ...m, pushed: 1 })),
          );
        } catch (e) {
          console.error("Failed to push mutations", e);
        }
      })();
    }
  }, [pushPendingMutations]);

  // Hydrate pool
  useEffect(() => {
    (async () => {
      if (poolHydrated) {
        return;
      }
      // Hydrate pool
      setPoolHydrated(true);
      const poolHydration = await props.store.getHydration();
      poolHydration.forEach((item) => ensureRelationships(pool, item));
      setPool([...pool, ...poolHydration]);
      setData({ ...data });
    })();
  }, []);

  // Handle mutations
  const mutate = (mutations: Mutation[], local: boolean) => {
    // Persist to store
    void props.store.storeMutations(mutations);

    // Apply
    const result = applyMutations(mutations, {
      user,
      account,
      pool,
    });
    setPool([...pool, ...result.createdPoolItems]);
    setData({ ...data });

    // Ensure relationships
    result.updatedPoolItems.forEach((item) => {
      ensureRelationships(pool, item);
    });

    // Persist to pool store
    props.store.storePoolItems(result.updatedPoolItems);
  };

  return (
    <SyncContext.Provider
      value={{
        userId: user.id,
        accountId: account.id,
        pool,
        data,
        reRender: () => setData({ ...data }),
        addToPool: (obj) => setPool([...pool, obj]),
        mutate: (mutations) => mutate(mutations, true),
      }}
    >
      {props.children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("Missing SyncProvider");
  }
  return {
    data: context.data,
    update: (u: Update) =>
      context.mutate(
        mutationsFromUpdate(u, {
          userId: context.data.user.id,
          accountId: context.data.account.id,
        }),
      ),
    create: (u: Create) =>
      context.mutate(
        mutationsFromCreate(u, {
          userId: context.data.user.id,
          accountId: context.data.account.id,
        }),
      ),
  };
};

const ensureRelationships = (pool: Pool, item: PoolItem) => {
  const idFields = Object.keys(item).filter((k) => k.endsWith("Id"));
  idFields.forEach((idField) => {
    // Object relation
    const relationKey = idField.replace("Id", "");
    const related = pool.find((p) => p.id === item[idField]);
    if (!item.ref) {
      item.ref = {};
    }
    item.ref[relationKey] = related!;

    // Array relation
    let parentModel: string = relationKey;
    switch (relationKey) {
      case "owner":
        parentModel = "user";
        break;
    }
    const parent = pool.find((i) => {
      return i.model === parentModel && i.id === item[idField];
    });
    if (!parent) {
      console.error("Parent not found", parentModel, item[idField]);
      return;
    }
    if (!parent.col[relationKey + "s"]) {
      parent.col[relationKey + "s"] = [];
    }
    if (!parent.col[item.model + "s"].includes(item)) {
      parent.col[item.model + "s"].push(item);
    }
  });
};
