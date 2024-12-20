import { authorizer } from "@openauthjs/openauth";
import { GoogleAdapter } from "@openauthjs/openauth/adapter/google";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { jwtDecode } from "jwt-decode";
import { subjects } from "./subjects";

const app = authorizer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    google: GoogleAdapter({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["email", "profile"],
    }),
  },
  success: async (ctx, value) => {
    if (value.provider === "google") {
      const decoded = jwtDecode(value.tokenset.raw.id_token);
      return ctx.subject("user", {
        id: decoded.sub || "not found",
      });
    }
    throw new Error("Invalid provider");
  },
});

export default app;
