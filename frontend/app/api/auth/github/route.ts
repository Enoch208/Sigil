import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE } from "@/lib/auth/session";

/**
 * Begin GitHub sign-in. If an OAuth app is configured, redirect to GitHub's
 * authorize screen; otherwise fall back to a demo session so the flow always
 * lands the user in the product.
 */
export async function GET(request: Request): Promise<Response> {
  const { origin } = new URL(request.url);
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL("/api/auth/demo", origin));
  }

  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/auth/callback`);
  authorize.searchParams.set("scope", "read:user");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize);
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
