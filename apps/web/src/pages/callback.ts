import type { APIRoute } from "astro";
import { client, setTokens } from "../auth";

export const GET: APIRoute = async (ctx) => {
  const code = ctx.url.searchParams.get("code");
  try {
    const exchangeResult = await client.exchange(
      code!,
      ctx.url.origin + "/callback",
    );
    if (exchangeResult.err === false) {
      setTokens(
        ctx,
        exchangeResult.tokens.access,
        exchangeResult.tokens.refresh,
      );
    }
    return ctx.redirect("/", 302);
  } catch (e) {
    return Response.json(e, {
      status: 400,
    });
  }
};
