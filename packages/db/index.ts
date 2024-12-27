import {
  AccountUserRelations,
  AccountRelations,
  UserRelations,
} from "./src/relations";
import { User, Account, AccountUser } from "./src/schema";

export * from "./src/schema";
export * from "./src/relations";

export const schema = {
  User,
  Account,
  AccountUser,
  AccountUserRelations,
  AccountRelations,
  UserRelations,
};
