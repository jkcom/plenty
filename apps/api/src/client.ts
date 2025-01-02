import type { CreateAccountPayload } from "types";
import type {
  CreateAccountInputType,
  SlugAvailableInputType,
  SlugAvailableResponseType,
} from "./rest/accounts";
import type {
  SuggestedAccountSlugInputType,
  SuggestedAccountSlugResponseType,
} from "./misc/account-slug/suggested";
import type { Mutation } from "../../../packages/sync/src/mutations";

// Create account
export const createAccount = async (
  token: string,
  data: CreateAccountInputType,
) => {
  const response = await fetch("http://localhost:3001/rest/accounts", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response.json()) as CreateAccountPayload;
};

// Slug available
export const slugAvailable = async (
  token: string,
  data: SlugAvailableInputType,
) => {
  const response = await fetch(
    "http://localhost:3001/rest/accounts/slug-available",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return (await response.json()) as SlugAvailableResponseType;
};

// Suggested account slug
export const suggestedAccountSlug = async (
  token: string,
  data: SuggestedAccountSlugInputType,
) => {
  const response = await fetch(
    "http://localhost:3001/misc/account-slug/suggested",
    {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${token}`,
      },
    },
  );

  return (await response.json()) as SuggestedAccountSlugResponseType;
};

export const postMutations = async (token: string, mutations: Mutation[]) => {
  const response = await fetch("http://localhost:3001/rest/mutations", {
    method: "post",
    body: JSON.stringify(mutations),
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${token}`,
    },
  });

  return await response.json();
};
