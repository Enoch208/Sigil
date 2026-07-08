import { audit, loopBadge, BADGE_CONTENT_TYPE, BADGE_CACHE_CONTROL } from "@/lib/loop";
import { getProjectSources } from "@/lib/loop/fixtures/registry";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ handle: string; project: string }> },
): Promise<Response> {
  const { handle, project } = await ctx.params;
  const sources = getProjectSources(handle, project);
  if (!sources) {
    return new Response("project not found", { status: 404 });
  }

  const { report, timeline } = audit(sources);
  const svg = loopBadge(report.score, {
    iterations: timeline.iterations,
    banked: timeline.banked,
  });

  return new Response(svg, {
    headers: {
      "content-type": BADGE_CONTENT_TYPE,
      "cache-control": BADGE_CACHE_CONTROL,
    },
  });
}
