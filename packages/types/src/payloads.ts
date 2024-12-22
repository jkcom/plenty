import type { AccountSelectType, AccountUserSelectType } from "db";

export type AbstractPayload = {
  status: "success" | "error";
};

export type AccountsPayload = AbstractPayload & {
  accounts: (AccountSelectType & {
    accountUser: AccountUserSelectType;
  })[];
};
