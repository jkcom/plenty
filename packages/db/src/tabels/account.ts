import { pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const Account = pgTable("accounts", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(nanoid),
  accountName: varchar({ length: 255 }).notNull().unique(),
});
