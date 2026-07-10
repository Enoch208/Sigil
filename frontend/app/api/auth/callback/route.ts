import { NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE, sessionCookie, type Session } from "@/lib/auth/session";

/** GitHub OAuth callback: exchange the code for a token, read the profile, sign in. */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { origin } = url;
  const fail = (reason: string) => NextResponse.redirect(new URL(`/signin?error=${reason}`, origin));

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers.get("cookie")?.match(/sigil_oauth_state=([^;]+)/)?.[1];

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("config");
  if (!code) return fail("denied");
  if (!state || state !== cookieState) return fail("state");

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/auth/callback`,
        state,
      }),
    });
    const token = (await tokenRes.json())?.access_token as string | undefined;
    if (!token) return fail("token");

    const userRes = await fetch("https://api.github.com/user", {
      headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "user-agent": "Sigil" },
    });
    if (!userRes.ok) return fail("user");
    const user = await userRes.json();

    const session: Session = {
      login: user.login,
      name: user.name || user.login,
      avatar: user.avatar_url,
      demo: false,
    };
    const res = NextResponse.redirect(new URL("/season", origin));
    const c = sessionCookie(session);
    res.cookies.set(c.name, c.value, c.options);
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch {
    return fail("network");
  }
}
