import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { Account } from "./account";
import { User } from "./user";

export const AccountUser = pgTable("account_user", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),

  // Foreign keys
  accountId: varchar({ length: 255 })
    .notNull()
    .references(() => Account.id, {
      onDelete: "cascade",
    }),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => User.id, {
      onDelete: "cascade",
    }),
});
