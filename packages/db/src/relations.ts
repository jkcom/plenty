import { relations } from "drizzle-orm";
import { Account, AccountUser, User } from "./schema";

export const AccountRelations = relations(Account, ({ many }) => ({
  accountUsers: many(AccountUser),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accountUsers: many(AccountUser),
}));

export const AccountUserRelations = relations(AccountUser, ({ one }) => ({
  account: one(Account),
  user: one(User),
}));