import { audit, BADGE_CACHE_CONTROL } from "@/lib/loop";
import { getProjectSources } from "@/lib/loop/fixtures/registry";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ handle: string; project: string }> },
): Promise<Response> {
  const { handle, project } = await ctx.params;
  const sources = getProjectSources(handle, project);
  if (!sources) {
    return Response.json({ error: "project not found" }, { status: 404 });
  }

  const { report, timeline } = audit(sources);
  return Response.json(
    { report, timeline },
    { headers: { "cache-control": BADGE_CACHE_CONTROL } },
  );
}
