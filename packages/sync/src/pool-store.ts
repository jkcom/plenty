import type { Mutation } from "./mutations";
import type { PoolItem } from "./types";

export type SyncStore = {
  // Pool
  getHydration: () => Promise<PoolItem[]>;
  storePoolItems: (items: PoolItem[]) => void;

  // Mutations
  storeMutations: (mutations: Mutation[]) => void;
  getPushPendingMutations: () => Promise<Mutation[]>;
  updateMutations: (mutations: Mutation[]) => void;
};
