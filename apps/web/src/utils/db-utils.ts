import { Account, User } from "db";
import { db } from "../db";
import { eq } from "drizzle-orm";
import type { AstroGlobal, LocalImageService } from "astro";

export const getUser = async (providerId: string) => {
  const userQuery = await db
    .select()
    .from(User)
    .where(eq(User.providerId, providerId));
  return userQuery[0] || null;
};

export const getAccount = async (slug: string) => {
  const accountQuery = await db
    .select()
    .from(Account)
    .where(eq(Account.slug, slug));
  return accountQuery[0] || null;
};

interface ContextInput {
  providerId: string;
  accountSlug: string;
}
export const getContext = async (input: ContextInput) => {
  try {
    const user = await db.query.User.findFirst({
      where: eq(User.providerId, input.providerId),
      with: {
        accountUsers: {
          with: {
            account: true,
          },
        },
      },
    });
    const accountUser = user?.accountUsers.find(
      (au) => au.account?.slug === input.accountSlug,
    );
    const userAccounts = user?.accountUsers.map((au) => ({
      name: au.account?.name,
      slug: au.account?.slug,
    }));
    const account = accountUser?.account;
    return {
      user,
      userAccounts,
      account,
      accountUser,
    };
  } catch (error) {
    console.error(error);
  }
};
