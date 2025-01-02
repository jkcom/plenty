import type { Create, ModelType, Update } from "./types";
import { nanoid } from "nanoid";

type Context = {
  userId: string;
  accountId: string;
};

export const update = (update: Update, context: Context) => {
  const mutations: Mutation[] = [];
  for (const key in update.values) {
    mutations.push(
      pushMutation({
        id: nanoid(),
        pushed: 0,
        type: "update",
        model: update.model,
        objectId: update.id,
        field: key,
        value: (update.values as Record<string, any>)?.[key],
        ...context,
      }),
    );
  }
  return mutations;
};

export const mutationsFromCreate = (create: Create, context: Context) => {
  const objectId = nanoid();
  const mutations: Mutation[] = [
    {
      id: nanoid(),
      pushed: 0,
      type: "create",
      model: create.model,
      objectId,
      ...context,
    },
  ];
  mutations.push(...update({ id: objectId, ...create }, context));
  return mutations;
};

export type Mutation =
  | {
      id: string;
      pushed: 0 | 1;
      type: "update";
      model: ModelType;
      objectId: string;
      field?: string;
      value?: unknown;
      userId: string;
      accountId: string;
    }
  | {
      id: string;
      pushed: 0 | 1;
      type: "create";
      model: ModelType;
      objectId: string;
      userId: string;
      accountId: string;
    };

const pushMutation = (mutation: Mutation) => {
  return mutation;
};
