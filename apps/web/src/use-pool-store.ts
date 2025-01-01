import { type PoolStore } from "sync";
import type { ModelType, PoolItem } from "../../../packages/sync/src/types";
import { useState, useEffect } from "react";

type PoolStoreOptions = {
  version: number;
  accountId?: string;
  userId?: string;
  objectStores: ObjectStoreOptions[];
};

type ObjectStoreOptions = {
  model: ModelType;
};

export const usePoolStore = (options: PoolStoreOptions) => {
  const store = new Map<string, PoolItem[]>();
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [hydrationPool, setHydrationPool] = useState<PoolItem[]>();

  // Init db
  useEffect(() => {
    (async () => {
      if (options.accountId || options.userId) {
        const db = await getDB(options);
        setDb(db);

        const hp: PoolItem[] = [];

        await Promise.all(
          options.objectStores.map((store) => {
            return new Promise((resolve) => {
              const transaction = db.transaction(store.model, "readonly");
              const objectStore = transaction.objectStore(store.model);
              const request = objectStore.getAll();
              request.onsuccess = (event) => {
                hp.push(...request.result);
                resolve(true);
              };
            });
          }),
        );

        setHydrationPool(hp);
        console.log("Hydration pool: ", hp);
      }
    })();
  }, []);

  return {
    hydrationPool,
    set: (storeKey, items) => {
      options.objectStores.forEach((store) => {
        const filteredItems = items.filter(
          (item) => item.model === store.model,
        );
        const transaction = db!.transaction(store.model, "readwrite");
        const objectStore = transaction.objectStore(store.model);
        filteredItems.forEach((item) => {
          const { ref, col, ...stripped } = item;
          objectStore.add(stripped);
        });
        transaction.onerror = (event) => {
          console.error("Error adding item: ", event);
        };
        transaction.oncomplete = (event) => {
          console.log("Item added: ", event);
        };
      });
    },
    ready: !!db,
  };
};

const getDB = async (options: PoolStoreOptions): Promise<IDBDatabase> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(options.accountId + "-" + options.userId, 1);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      options.objectStores.forEach((store) => {
        db.createObjectStore(store.model, { keyPath: "id" });
      });
    };
    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
};
