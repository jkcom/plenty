import type { AccountSelectType, UserSelectType } from "db";

export type LcUser = UserSelectType & {};

export type LcAccount = AccountSelectType & {
  owner?: LcUser;
};

export type Update = {
  id: string;
  model: "account";
  values: Partial<AccountSelectType>;
};
