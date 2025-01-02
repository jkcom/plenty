import { useEffect, useState } from "react";
import type { SyncStore } from "./pool-store";
import type { Mutation } from "./mutations";

export const useMutationPoll = (store: SyncStore) => {
  const [pushPendingMutations, setPushPendingMutations] = useState<Mutation[]>(
    [],
  );

  const checkPendingMutations = async () => {
    setPushPendingMutations(await store.getPushPendingMutations());
  };

  useEffect(() => {
    setInterval(async () => {
      await checkPendingMutations();
    }, 1000);
  }, []);

  return {
    pushPendingMutations,
    checkPendingMutations,
  };
};
