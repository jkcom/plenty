import type { Mutation } from "./mutations";
import type { LcAccount, LcUser, Pool, PoolItem } from "./types";

export const applyMutations = (
  mutations: Mutation[],
  context: {
    user: LcUser;
    account: LcAccount;
    pool: Pool;
  },
): {
  createdPoolItems: PoolItem[];
  updatedPoolItems: PoolItem[];
} => {
  const createdPoolItems: PoolItem[] = [];
  const updatedPoolItems: PoolItem[] = [];

  // Apply mutation local objects
  mutations.forEach((m) => {
    switch (m.type) {
      case "create":
        const newItem: PoolItem = {
          id: m.objectId,
          model: m.model,
          ownerId: context.user.id,
          accountId: context.account.id,
          ref: {},
          col: {},
        };
        createdPoolItems.push(newItem);
        updatedPoolItems.push(newItem);
        break;
      case "update":
        const target = [...createdPoolItems, ...context.pool].find(
          (p) => p.id === m.objectId,
        );
        if (!target) {
          console.error("Object not found", m.objectId);
          return;
        }
        (target as Record<string, any>)[m.field!] = m.value;
        if (!updatedPoolItems.includes(target)) {
          updatedPoolItems.push(target);
        }
        break;
    }
  });

  return {
    createdPoolItems,
    updatedPoolItems,
  };
};
