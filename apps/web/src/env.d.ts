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
      slug: string;
    }[];
    account?: {
      name: string;
      id: string;
    } | null;
    accountUser?: {
      role: "user" | "admin" | "mod";
    } | null;
  }
}
