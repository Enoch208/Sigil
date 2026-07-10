import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Clear the session and return to the landing page. */
export async function GET(request: Request): Promise<Response> {
  const { origin } = new URL(request.url);
  const res = NextResponse.redirect(new URL("/", origin));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
