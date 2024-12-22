import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { db } from "../db";
import { Account, AccountUser, User } from "db";
import { eq, and } from "drizzle-orm";

const app = new Hono();

app.get("/", async (c) => {
  const user = c.get("user");
  const results = await db
    .select()
    .from(AccountUser)
    .where(eq(AccountUser.userId, user.id))
    .leftJoin(Account, and(eq(Account.id, AccountUser.accountId)));

  return c.json({
    status: "success",
    accounts: results.map((result) => ({
      ...result.accounts,
      accountUser: result.account_user,
    })),
  });
});

export const accountPostSchema = z.object({
  accountName: z.string(),
});

app.post(
  "/",
  validator("json", async (value, c) => {
    const json = await c.req.json();
    const parsed = accountPostSchema.safeParse(json);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { accountName } = c.req.valid("json");
    const user = c.get("user");

    // Create account
    const account = (
      await db
        .insert(Account)
        .values({
          name: accountName,
          slug: accountName,
          ownerId: user.id,
        })
        .returning()
    )[0];

    // Create account user
    await db
      .insert(AccountUser)
      .values({
        role: "admin",
        accountId: account.id,
        userId: user.id,
      })
      .returning();

    return c.json({
      status: "success",
      account: accountName,
    });
  },
);

export default app;
