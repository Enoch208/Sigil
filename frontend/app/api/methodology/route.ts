import { getMethodology, BADGE_CACHE_CONTROL } from "@/lib/loop";

export async function GET(): Promise<Response> {
  return Response.json(getMethodology(), {
    headers: { "cache-control": BADGE_CACHE_CONTROL },
  });
}
