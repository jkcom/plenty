import type { APIRoute } from "astro";

export const GET: APIRoute = ({ locals, cookies, redirect }) => {
  // Clear the session cookie
  cookies.delete("refresh_token", { path: "/" });
  cookies.delete("access_token", { path: "/" });
  cookies.delete("adapter", { path: "/" });

  // Redirect to the home page
  return redirect("/", 302);
};
