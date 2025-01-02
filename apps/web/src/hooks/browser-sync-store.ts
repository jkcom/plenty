import type { SyncStore } from "sync";
import type { PoolItem } from "../../../../packages/sync/src/types";
import type { Mutation } from "../../../../packages/sync/src/mutations";
let db: IDBDatabase | null = null;

type Options = {
  version: number;
  accountId?: string;
  userId?: string;
};

const objectStores = [
  {
    model: "mutations",
    hydrate: false,
    index: [
      {
        name: "pushed",
        keyPath: "pushed",
        unique: false,
      },
    ],
  },
  { model: "post", hydrate: true },
];

export const useBrowserSyncStore = (options: Options): SyncStore => {
  return {
    getHydration: async () => {
      const db = await getDB(options);
      const items = await Promise.all(
        objectStores
          .filter((os) => os.hydrate)
          .map(
            (store) =>
              new Promise<PoolItem[]>((resolve, reject) => {
                const result = db
                  .transaction(store.model, "readonly")
                  .objectStore(store.model)
                  .getAll();

                result.onsuccess = () => {
                  resolve(result.result);
                };

                result.onerror = () => {
                  reject(result.error);
                };
              }),
          ),
      );
      return items.flat();
    },
    storePoolItems: async (items) => {
      const db = await getDB(options);
      objectStores.forEach((store) => {
        const filteredItems = items.filter(
          (item) => item.model === store.model,
        );
        const transaction = db.transaction(store.model, "readwrite");
        const objectStore = transaction.objectStore(store.model);

        filteredItems.forEach((item) => {
          const { ref, col, ...stripped } = item;
          objectStore.put(stripped);
        });
      });
    },
    storeMutations: async (mutations) => {
      const db = await getDB(options);
      const transaction = db.transaction("mutations", "readwrite");
      const objectStore = transaction.objectStore("mutations");
      mutations.forEach((mutation) => {
        objectStore.add(mutation);
      });
    },
    getPushPendingMutations: async () => {
      const db = await getDB(options);
      return new Promise<Mutation[]>((resolve, reject) => {
        const result = db
          .transaction("mutations", "readonly")
          .objectStore("mutations")
          .index("pushed")
          .getAll(0);

        result.onsuccess = () => {
          resolve(result.result);
        };

        result.onerror = () => {
          reject(result.error);
        };
      });
    },
    updateMutations: async (mutations) => {
      const db = await getDB(options);
      const transaction = db.transaction("mutations", "readwrite");
      const objectStore = transaction.objectStore("mutations");
      mutations.forEach((mutation) => {
        objectStore.put(mutation);
      });
    },
  };
};

const getDB = async (options: Options): Promise<IDBDatabase> => {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      options.accountId + "_" + options.userId,
      options.version,
    );

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      objectStores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.model)) {
          const objectStore = db.createObjectStore(store.model, {
            keyPath: "id",
          });
          store.index?.forEach((index) => {
            const i = objectStore.createIndex(index.name, index.keyPath, {
              unique: index.unique,
              multiEntry: true,
            });
          });
        }
      });
    };
  });
};
