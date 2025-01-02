import { Hono } from "hono";
import { db } from "../db";
import { Mutation } from "db";

const mutations = new Hono();

// Post mutations
mutations.post("/", async (c) => {
  const user = c.get("user");
  const mutations = await c.req.json();
  await db.insert(Mutation).values(mutations);
  return c.json({
    status: "success",
  });
});

export default mutations;
