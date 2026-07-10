import { NextResponse } from "next/server";
import { sessionCookie, type Session } from "@/lib/auth/session";

/** Reliable demo sign-in — used when no GitHub OAuth app is configured. */
export async function GET(request: Request): Promise<Response> {
  const { origin } = new URL(request.url);
  const session: Session = {
    login: "octocat",
    name: "The Octocat",
    avatar: "https://github.com/octocat.png",
    demo: true,
  };
  const res = NextResponse.redirect(new URL("/season", origin));
  const c = sessionCookie(session);
  res.cookies.set(c.name, c.value, c.options);
  return res;
}
