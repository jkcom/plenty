import type { PoolItem } from "./types";

export type PoolStoreKey = {
  model: string;
};

export type PoolStore = {
  getAll: (storeKey: PoolStoreKey) => PoolItem[];
  set: (storeKey: PoolStoreKey, items: PoolItem[]) => void;
};
