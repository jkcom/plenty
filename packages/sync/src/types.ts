import type {
  AccountSelectType,
  UserSelectType,
  PostSelectType,
  PostInsertType,
  AccountInsertType,
} from "db";

export type PoolItem = {
  model: ModelType;
  id: string;
  ownerId: string | null;
  accountId: string | null;
  ref: Record<string, PoolItem>;
  col: Record<string, PoolItem[]>;
};
export type Pool = PoolItem[];

// Model types
export type ModelType = "account" | "post" | "user";

export type LcUser = PoolItem &
  UserSelectType & {
    model: "user";
    col: {
      posts: LcPost[];
    };
  };

// Account
export type LcAccount = PoolItem &
  AccountSelectType & {
    model: "account";
    ref: {
      owner?: LcUser;
    };
    col: {
      posts: LcPost[];
    };
  };

// Post
export type LcPost = PoolItem &
  PostSelectType & {
    model: "post";
    ref: {
      owner: LcUser;
      account: LcAccount;
    };
  };

export type Update = Create & {
  id: string;
};

export type Create =
  | {
      model: "account";
      values: Partial<AccountInsertType>;
    }
  | {
      model: "post";
      values: Partial<PostInsertType>;
    };
