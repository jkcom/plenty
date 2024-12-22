import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { User } from "./user";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const Account = pgTable("accounts", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),

  // Foreign keys
  ownerId: varchar({ length: 255 }).references(() => User.id, {
    onDelete: "cascade",
  }),
});

export type AccountInsertType = InferInsertModel<typeof Account>;
export type AccountSelectType = InferSelectModel<typeof Account>;
