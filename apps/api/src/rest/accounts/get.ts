import { Account, AccountUser } from "db";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db";

const app = new Hono();

// All
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

export default app;
