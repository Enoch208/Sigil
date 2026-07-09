import type { LoopScore } from "./types";

export interface Badge {
  label: string;
  message: string;
  color: string;
}

/** Serving hints for the API route that streams the badge (TC-PUB freshness ≤ 60s). */
export const BADGE_CONTENT_TYPE = "image/svg+xml";
export const BADGE_CACHE_CONTROL =
  "public, max-age=60, s-maxage=60, stale-while-revalidate=300";

const CHAR_WIDTH = 6.6; // monospace advance at 11px
const PAD = 7;
const HEIGHT = 20;
const LABEL_BG = "#24292e";

const BANDS = {
  green: "#3fb950",
  yellow: "#d29922",
  orange: "#cc6b2c",
  red: "#e5534b",
} as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function segmentWidth(text: string): number {
  return Math.ceil(text.length * CHAR_WIDTH) + PAD * 2;
}

/** Render a flat, shields-style SVG badge as a self-contained string. */
export function renderBadge({ label, message, color }: Badge): string {
  const labelW = segmentWidth(label);
  const msgW = segmentWidth(message);
  const totalW = labelW + msgW;
  const labelCx = labelW / 2;
  const msgCx = labelW + msgW / 2;

  const l = escapeXml(label);
  const m = escapeXml(message);
  const aria = `${l}: ${m}`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${HEIGHT}" role="img" aria-label="${aria}">` +
    `<title>${aria}</title>` +
    `<linearGradient id="g" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>` +
    `<clipPath id="r"><rect width="${totalW}" height="${HEIGHT}" rx="3" fill="#fff"/></clipPath>` +
    `<g clip-path="url(#r)">` +
    `<rect width="${labelW}" height="${HEIGHT}" fill="${LABEL_BG}"/>` +
    `<rect x="${labelW}" width="${msgW}" height="${HEIGHT}" fill="${escapeXml(color)}"/>` +
    `<rect width="${totalW}" height="${HEIGHT}" fill="url(#g)"/>` +
    `</g>` +
    `<g fill="#fff" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="11">` +
    `<text x="${labelCx}" y="15" fill="#010101" fill-opacity=".3">${l}</text>` +
    `<text x="${labelCx}" y="14">${l}</text>` +
    `<text x="${msgCx}" y="15" fill="#010101" fill-opacity=".3">${m}</text>` +
    `<text x="${msgCx}" y="14">${m}</text>` +
    `</g>` +
    `</svg>`
  );
}

function bandColor(scoreValue: number, contradicted: number): string {
  if (contradicted > 0) return BANDS.red;
  if (scoreValue >= 95) return BANDS.green;
  if (scoreValue >= 75) return BANDS.yellow;
  if (scoreValue >= 50) return BANDS.orange;
  return BANDS.red;
}

/** Compose the standard Sigil badge from a score plus optional loop stats. */
export function loopBadge(
  score: LoopScore,
  meta: { iterations?: number; banked?: number } = {},
): string {
  const iterations = meta.iterations ?? score.total;
  const banked = meta.banked ?? 0;
  const status =
    score.contradicted > 0 ? "contested" : score.score >= 95 ? "verified" : "audited";
  const message = `${status} · ${iterations} iter · ${banked} banked · integrity ${score.score}`;
  return renderBadge({
    label: "loop",
    message,
    color: bandColor(score.score, score.contradicted),
  });
}
