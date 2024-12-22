import { defineMiddleware } from "astro:middleware";
import { client, setTokens } from "./auth";
import { subjects } from "auth/subjects";
import { getUser } from "./utils/db-utils";

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.routePattern === "/callback") {
    return next();
  }

  try {
    const accessToken = ctx.cookies.get("access_token");
    if (accessToken) {
      ctx.locals.accessToken = accessToken?.value;
      const refreshToken = ctx.cookies.get("refresh_token");
      const verified = await client.verify(subjects, accessToken.value, {
        refresh: refreshToken?.value,
      });
      if (!verified.err) {
        if (verified.tokens) {
          setTokens(ctx, verified.tokens.access, verified.tokens.refresh);
        }
        if (verified.subject.properties) {
          console.log(verified.subject.properties);
          ctx.locals.user = await getUser(verified.subject.properties.id);
        }
        return next();
      }
    }
  } catch (e) {}

  const { url } = await client.authorize(
    new URL(ctx.request.url).origin + "/callback",
    "code",
  );
  return Response.redirect(url, 302);
});
