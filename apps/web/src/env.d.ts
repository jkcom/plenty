/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    accessToken: string | null;
    user: {
      id: string;
      name: string;
    } | null;
    userAccounts?: {
      name: string;
    }[];
    account?: {
      name: string;
      id: string;
      slug: string;
    } | null;
    accountUser?: {
      role: "user" | "admin" | "mod";
    } | null;
  }
}
