import { audit, aggregateSeason, BADGE_CACHE_CONTROL } from "@/lib/loop";
import { listProjects } from "@/lib/loop/fixtures/registry";
import type { SeasonProject } from "@/lib/loop";

export async function GET(): Promise<Response> {
  const projects: SeasonProject[] = listProjects().map(({ handle, project, sources }) => {
    const { report, timeline } = audit(sources);
    return { handle, project, report, timeline };
  });

  const summary = aggregateSeason(projects);
  return Response.json(summary, {
    headers: { "cache-control": BADGE_CACHE_CONTROL },
  });
}
