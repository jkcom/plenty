/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    accessToken: string | null;
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      provider: string;
      providerId: string;
      picture: string;
    } | null;
    userAccounts?: {
      name: string;
    }[];
    account?: {
      name: string;
      id: string;
      slug: string;
      ownerId: string;
    } | null;
    accountUser?: {
      role: "user" | "admin" | "mod";
    } | null;
  }
}
