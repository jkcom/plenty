import type { AccountSelectType, UserSelectType } from "db";
import { createContext, useContext, useState } from "react";
import type { LcAccount, Update } from "./types";
import { update, type Mutation } from "./mutations";

type PlentyData = {
  account: LcAccount;
};

interface SyncContextType {
  data?: PlentyData;
  pool: { id: string }[];
  reRender?: () => void;
}

const SyncContext = createContext<SyncContextType>({
  data: undefined,
  pool: [],
});

interface SyncProviderProps {
  user: UserSelectType;
  account: AccountSelectType;
  children: React.ReactNode;
}

export const SyncProvider = (props: SyncProviderProps) => {
  const [data, setData] = useState<PlentyData>({
    account: props.account,
  });

  return (
    <SyncContext.Provider
      value={{
        pool: [props.account, props.user],
        data,
        reRender: () => setData({ ...data }),
      }}
    >
      {props.children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context.data) {
    throw new Error("Missing SyncProvider");
  }

  const applyMutation = (mutation: Mutation) => {
    // Apply mutation to context.data
    const changeTarget = context.pool.find(
      (item) => item.id === mutation.objectId,
    );
    Object.keys(mutation.updates).forEach((key) => {
      console.log("mutate", mutation);
      changeTarget[key] = mutation.updates[key];
    });
    console.log(context.pool);
    context.reRender?.();
  };
  return {
    data: context.data,
    update: (u: Update) => applyMutation(update(u)),
  };
};
