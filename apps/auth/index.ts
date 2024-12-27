import { authorizer } from "@openauthjs/openauth";
import { GoogleAdapter } from "@openauthjs/openauth/adapter/google";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { jwtDecode } from "jwt-decode";
import { subjects } from "./subjects";
import type { GoogleIdToken } from "types";
import { User, type UserInsertType, type UserSelectType } from "db";
import { eq } from "drizzle-orm";
import { db } from "./src/db";

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
      const decoded = jwtDecode(value.tokenset.raw.id_token) as GoogleIdToken;
      await getOrCreateUser(decoded.sub, {
        name: decoded.name || "Unknown",
        email: decoded.email,
        username: decoded.email,
        provider: "google",
        providerId: decoded.sub,
        picture: decoded.picture,
      });
      return ctx.subject("user", {
        id: decoded.sub || "not found",
      });
    }
    throw new Error("Invalid provider");
  },
});

const getOrCreateUser = async (
  providerId: string,
  userValues: UserInsertType,
): Promise<UserSelectType | null> => {
  // Check if the user already exists
  const userQuery = await db
    .select()
    .from(User)
    .where(eq(User.providerId, providerId));
  const user = userQuery[0] || null;

  // If the user doesn't exist, create a new user
  if (!user) {
    const newUser = await db.insert(User).values(userValues).returning();
    return newUser[0] || null;
  } else {
    return user;
  }
};

export default app;
