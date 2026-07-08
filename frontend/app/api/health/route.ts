/**
 * Liveness + deployed-commit probe. Returns the commit the running deployment
 * was built from, so a nightly rerun can prove the fix is actually live.
 */
export async function GET(): Promise<Response> {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA ?? "local";
  return Response.json(
    { status: "ok", commit, time: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
