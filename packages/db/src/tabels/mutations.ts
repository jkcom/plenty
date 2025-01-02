import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { User } from "./user";
import { Account } from "./account";

export const Mutation = pgTable("mutations", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),
  model: varchar({ length: 255 }).notNull(),
  objectId: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 255 }).notNull(),
  field: varchar({ length: 255 }),
  value: varchar({ length: 255 }),

  // Foreign keys
  userId: varchar({ length: 255 }).references(() => User.id, {
    onDelete: "cascade",
  }),

  accountId: varchar({ length: 255 }).references(() => Account.id, {
    onDelete: "cascade",
  }),
});
