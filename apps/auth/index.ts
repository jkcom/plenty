import { authorizer, createSubjects } from "@openauthjs/openauth";
import { GoogleAdapter } from "@openauthjs/openauth/adapter/google";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";

import { object, string } from "valibot";

const subjects = createSubjects({
  user: object({
    userID: string(),
  }),
});

export const app = authorizer({
  providers: {
    google: GoogleAdapter({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["email", "profile"],
    }),
  },
  subjects,
  async success(ctx, value) {
    let userID;
    switch (value.provider) {
      case "google":
        userID = "1234";
        break;
    }
    if (!userID) {
      throw new Error("Invalid userID");
    }
    return ctx.subject("user", {
      userID,
    });
  },
  storage: MemoryStorage(),
});

export default app;
