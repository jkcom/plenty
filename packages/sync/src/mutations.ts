import type { Create, ModelType, Update } from "./types";
import { nanoid } from "nanoid";

export const update = (update: Update) => {
  const mutations: Mutation[] = [];
  for (const key in update.values) {
    mutations.push(
      pushMutation({
        type: "update",
        model: update.model,
        objectId: update.id,
        field: key,
        value: (update.values as Record<string, any>)?.[key],
        userId: "user-id",
      }),
    );
  }
  return mutations;
};

export const mutationsFromCreate = (create: Create) => {
  const id = nanoid();
  const mutations: Mutation[] = [
    {
      type: "create",
      model: create.model,
      objectId: id,
      userId: "user-id",
    },
  ];
  mutations.push(...update({ id, ...create }));
  return mutations;
};

export type Mutation =
  | {
      type: "update";
      model: ModelType;
      objectId: string;
      field?: string;
      value?: unknown;
      userId: string;
    }
  | {
      type: "create";
      model: ModelType;
      objectId: string;
      userId: string;
    };

const pushMutation = (mutation: Mutation) => {
  return mutation;
};
