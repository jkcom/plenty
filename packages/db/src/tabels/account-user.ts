import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { UserRoleEnumValues } from "types";
import { Account } from "./account";
import { User } from "./user";

export const AccountUser = pgTable("account_user", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),

  // Fields
  role: text({ enum: UserRoleEnumValues }).notNull(),

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

export type AccountUserInsertType = InferInsertModel<typeof AccountUser>;
export type AccountUserSelectType = InferSelectModel<typeof AccountUser>;
