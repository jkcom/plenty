import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { assertTypeMatch } from "../../utils/misc";
import { eq } from "drizzle-orm";
import { Account } from "db";
import { db } from "../../db";

const app = new Hono();

const suggestedAccountSlugSchema = z.object({
  accountName: z.string(),
});

export type SuggestedAccountSlugInputType = z.infer<
  typeof suggestedAccountSlugSchema
>;
export type SuggestedAccountSlugResponseType = {
  slug: string;
};

export const suggested = app.post(
  "/",
  zValidator("json", suggestedAccountSlugSchema),
  async (c) => {
    const { accountName } = c.req.valid("json");
    const slug = accountName.toLowerCase().replace(/\s+/g, "-");
    const uniqueSlug = await ensureUniqueSlug(slug);
    return c.json(
      assertTypeMatch<SuggestedAccountSlugResponseType>({
        slug: uniqueSlug,
      }),
    );
  },
);

const ensureUniqueSlug = async (slug: string) => {
  const baseSlug = slug;
  // Check if slug is unique
  while (!(await isSlugUnique(slug))) {
    slug = `${baseSlug}-${Math.floor(Math.random() * 100)}`;
  }
  return slug;
};

const isSlugUnique = async (slug: string) => {
  const results = await db.select().from(Account).where(eq(Account.slug, slug));
  return results.length === 0;
};
