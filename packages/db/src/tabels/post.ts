import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { User } from "./user";

export const Post = pgTable("posts", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),
  title: varchar({ length: 255 }).notNull(),
  body: text(),

  // Foreign keys
  ownerId: varchar({ length: 255 }).references(() => User.id, {
    onDelete: "cascade",
  }),
});

export type PostInsertType = InferInsertModel<typeof Post>;
export type PostSelectType = InferSelectModel<typeof Post>;
