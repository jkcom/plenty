/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    accessToken: string | null;
    user: {
      name: string;
    } | null;
  }
}
