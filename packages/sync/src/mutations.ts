import type { Update } from "./types";

export const update = (update: Update) => {
  return pushMutation({
    model: update.model,
    objectId: update.id,
    updates: update.values,
    userId: "user-id",
  });
};

export type Mutation = {
  model: string;
  objectId: string;
  updates: Record<string, any>;
  userId: string;
};
const pushMutation = (mutation: Mutation) => {
  return mutation;
};
