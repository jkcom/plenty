import type { AccountSelectType, UserSelectType } from "db";
import { createContext, useContext, useEffect, useState } from "react";
import { applyMutations } from "./apply-mutations";
import {
  mutationsFromCreate,
  update as mutationsFromUpdate,
  type Mutation,
} from "./mutations";
import type {
  Create,
  LcAccount,
  LcUser,
  Pool,
  PoolItem,
  Update,
} from "./types";
import type { PoolStore } from "./pool-store";

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
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  store: PoolStore;
  hydrate: PoolItem[];
  user: UserSelectType;
  account: AccountSelectType;
  children: React.ReactNode;
}

export const SyncProvider = (props: SyncProviderProps) => {
  const user: LcUser = {
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
  const [pool, setPool] = useState<Pool>([account, user, ...props.hydrate]);

  useEffect(() => {
    props.hydrate.forEach((item) => {
      ensureRelationships(pool, item);
    });
    setData({ ...data });
  }, [pool]);

  console.log("Pool", pool);

  return (
    <SyncContext.Provider
      value={{
        pool,
        data,
        reRender: () => setData({ ...data }),
        addToPool: (obj) => setPool([...pool, obj]),
        mutate: (mutations) => {
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
          props.store.set(
            { accountId: account.id, userId: user.id, model: "post" },
            result.updatedPoolItems.filter((i) => i.model === "post"),
          );
        },
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
    update: (u: Update) => context.mutate(mutationsFromUpdate(u)),
    create: (u: Create) => context.mutate(mutationsFromCreate(u)),
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
