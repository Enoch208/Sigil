import { cookies } from "next/headers";

/**
 * Minimal cookie-based session for the GitHub sign-in flow. We store only the
 * public identity needed to render "signed in as …" — never the access token.
 * Real OAuth activates automatically when GITHUB_CLIENT_ID / _SECRET are set;
 * otherwise sign-in falls back to a demo session so the flow is never a dead end.
 */
export interface Session {
  login: string;
  name: string;
  avatar: string;
  demo: boolean;
}

export const SESSION_COOKIE = "sigil_session";
export const OAUTH_STATE_COOKIE = "sigil_oauth_state";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(raw: string): Session | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (parsed && typeof parsed.login === "string" && typeof parsed.avatar === "string") {
      return { login: parsed.login, name: parsed.name ?? parsed.login, avatar: parsed.avatar, demo: !!parsed.demo };
    }
    return null;
  } catch {
    return null;
  }
}

/** Read the current session in a Server Component or Route Handler. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  return raw ? decodeSession(raw) : null;
}

/** Cookie descriptor for writing a session onto a NextResponse. */
export function sessionCookie(session: Session) {
  return {
    name: SESSION_COOKIE,
    value: encodeSession(session),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  };
}
