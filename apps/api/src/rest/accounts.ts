import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const app = new Hono();

app.get("/", (c) =>
  c.json({
    status: "success",
    accounts: [],
  }),
);

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
  (c) => {
    const { accountName } = c.req.valid("json");
    return c.json({
      status: "success",
      account: accountName,
    });
  },
);

export default app;
