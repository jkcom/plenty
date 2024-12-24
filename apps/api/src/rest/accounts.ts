import { Account, AccountUser, type AccountSelectType } from "db";
import { eq } from "drizzle-orm";
import { validator } from "hono/validator";
import type { AbstractPayload } from "types";
import { z } from "zod";

import { and } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { zValidator } from "@hono/zod-validator";
import { assertTypeMatch } from "../utils/misc";

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

// Create account
export const createAccountInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export type CreateAccountInputType = z.infer<typeof createAccountInputSchema>;
export type CreateAccountResponseType = AbstractPayload & {
  account: AccountSelectType;
};

app.post(
  "/",
  validator("json", async (value, c) => {
    const json = await c.req.json();
    const parsed = createAccountInputSchema.safeParse(json);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid("json");
    const user = c.get("user");

    // Create account
    const account = (
      await db
        .insert(Account)
        .values({
          ...data,
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
      account,
    });
  },
);

// Slug available
const slugAvaliableSchema = z.object({
  slug: z.string(),
});

export type SlugAvailableInputType = z.infer<typeof slugAvaliableSchema>;
export type SlugAvailableResponseType = AbstractPayload & {
  data:
    | {
        available: false;
        reason: string;
      }
    | {
        available: true;
      };
};

app.post(
  "/slug-available",
  zValidator("json", slugAvaliableSchema),
  async (c) => {
    const { slug } = c.req.valid("json");
    const results = await db
      .select()
      .from(Account)
      .where(eq(Account.slug, slug));

    if (results.length === 0) {
      return c.json(
        assertTypeMatch<SlugAvailableResponseType>({
          status: "success",
          data: {
            available: true,
          },
        }),
      );
    } else {
      return c.json(
        assertTypeMatch<SlugAvailableResponseType>({
          status: "error",
          data: {
            available: false,
            reason: "Slug is already taken",
          },
        }),
      );
    }
  },
);

export default app;
