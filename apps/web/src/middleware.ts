import { defineMiddleware } from "astro:middleware";
import { client, setTokens } from "./auth";
import { subjects } from "auth/subjects";
import { getAccount, getContext, getUser } from "./utils/db-utils";

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
          // Get context
          const context = await getContext({
            providerId: verified.subject.properties.id,
            accountSlug: ctx.params.accountSlug?.split("/")[0] as string,
          });

          if (context) {
            ctx.locals.user = context.user!;
            ctx.locals.userAccounts = context.userAccounts;
            ctx.locals.account = context.account;
            ctx.locals.accountUser = context.accountUser;
          }
        }
        return next();
      }
    } else {
      const { url } = await client.authorize(
        new URL(ctx.request.url).origin + "/callback",
        "code",
      );
      return Response.redirect(url, 302);
    }
  } catch (e) {}

  const { url } = await client.authorize(
    new URL(ctx.request.url).origin + "/callback",
    "code",
  );
  return Response.redirect(url, 302);
});
