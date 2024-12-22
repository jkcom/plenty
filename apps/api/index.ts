import { Hono } from "hono";
import { cors } from "hono/cors";
import accounts from "./src/rest/accounts";
import { subjects } from "auth/subjects";

import { createClient } from "@openauthjs/openauth/client";
import { HTTPException } from "hono/http-exception";
import { User, type UserSelectType } from "db";

import { eq } from "drizzle-orm";
import { db } from "./src/db";
export const client = createClient({
  clientID: "astro",
  issuer: "http://localhost:3000",
});

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

  next();
});

// Routes
app.route("/rest/accounts", accounts);

export default {
  port: 3001,
  fetch: app.fetch,
};
