import { subjects } from "auth/subjects";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createClient } from "@openauthjs/openauth/client";
import { User, type UserSelectType } from "db";
import { HTTPException } from "hono/http-exception";

import { eq } from "drizzle-orm";
import { db } from "./src/db";
import { suggested } from "./src/misc/account-slug/suggested";
import accounts from "./src/rest/accounts";
import mutations from "./src/rest/mutations";

export const client = createClient({
  clientID: "astro",
  issuer: "http://localhost:3000",
});

export * from "./src/client";

declare module "hono" {
  interface ContextVariableMap {
    user: UserSelectType;
  }
}
const app = new Hono();

// Cors
app.use(
  "*",
  cors({
    origin: "*", // Allow all origins
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  }),
);

// Auhorization
app.use("*", async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  // No token
  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Verify token
  const verified = await client.verify(subjects, token);

  // Load user
  if (verified.err) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Get the user
  const userQuery = await db
    .select()
    .from(User)
    .where(eq(User.providerId, verified.subject.properties.id));
  const user = userQuery[0] || null;

  // Check if the user exists
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Set the user
  c.set("user", user);

  return next();
});

// Routes
app.route("/rest/accounts", accounts);
app.route("/rest/mutations", mutations);
app.route("/misc/account-slug/suggested", suggested);

export default {
  port: 3001,
  fetch: app.fetch,
};
