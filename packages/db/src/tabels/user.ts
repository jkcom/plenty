import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const User = pgTable("users", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  provider: varchar({ length: 255 }).notNull(),
  providerId: varchar({ length: 255 }).notNull(),
});

export type UserInsertType = InferInsertModel<typeof User>;
export type UserSelectType = InferSelectModel<typeof User>;
