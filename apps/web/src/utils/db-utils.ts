import { User } from "db";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const getUser = async (providerId: string) => {
  const userQuery = await db
    .select()
    .from(User)
    .where(eq(User.providerId, providerId));
  return userQuery[0] || null;
};
