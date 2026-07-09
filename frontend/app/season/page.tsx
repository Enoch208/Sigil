import Link from "next/link";
import { audit, aggregateSeason } from "@/lib/loop";
import type { SeasonEntry } from "@/lib/loop";
import { listProjects } from "@/lib/loop/fixtures/registry";
import { AppNav } from "@/components/app/app-nav";

const STATUS: Record<SeasonEntry["status"], { text: string; bar: string; pill: string }> = {
  verified: { text: "text-positive", bar: "bg-positive", pill: "text-positive border-positive/40 bg-positive-bg" },
  audited: { text: "text-accent", bar: "bg-accent", pill: "text-accent border-accent/40 bg-accent-bg" },
  contested: { text: "text-negative", bar: "bg-negative", pill: "text-negative border-negative/40 bg-negative-bg" },
  narrative: { text: "text-fg-muted", bar: "bg-fg-muted/50", pill: "text-fg-muted border-hairline" },
};

function Totals({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface px-5 py-4 shadow-card">
      <div className="font-desc text-[11px] uppercase tracking-[0.14em] text-fg-muted">{label}</div>
      <div className="mt-1 font-display text-fluid-2xl font-semibold tabular-nums">{value}</div>
      {sub ? <div className="font-desc text-[12px] text-fg-muted">{sub}</div> : null}
    </div>
  );
}

export default async function SeasonPage() {
  const projects = listProjects().map(({ handle, project, sources }) => {
    const { report, timeline } = audit(sources);
    return { handle, project, report, timeline };
  });
  const summary = aggregateSeason(projects);
  const machineCheckable = summary.entries.filter((e) => e.coverage > 0).length;

  return (
    <div className="min-h-screen bg-page text-fg-primary">
      <AppNav />
      <main className="mx-auto max-w-[1080px] px-6 py-14 max-md:py-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-fluid-3xl font-semibold tracking-tight">Season 3 · Loop Index</h1>
            <p className="mt-2 max-w-[560px] font-desc text-[14px] leading-relaxed text-fg-muted">
              Every entry&apos;s loop, scored in one place. Machine-verifiable logs are highlighted; narrative
              logs are marked neutrally — never scored down.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <Totals label="Projects" value={String(summary.totals.projects)} />
          <Totals label="Machine-checkable" value={`${machineCheckable} / ${summary.totals.projects}`} sub="line-by-line" />
          <Totals label="Contradicted" value={String(summary.totals.contradicted)} sub="across the field" />
          <Totals label="Avg time-to-green" value={summary.avgTimeToGreenMs === null ? "—" : `${Math.round(summary.avgTimeToGreenMs / 1000)}s`} />
        </div>

        {/* leaderboard */}
        <div className="mt-10 overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
          <div className="grid grid-cols-[40px_1fr_180px_120px_90px] items-center gap-4 border-b border-hairline px-6 py-3 font-desc text-[11px] uppercase tracking-[0.12em] text-fg-muted max-md:grid-cols-[32px_1fr_90px]">
            <span>#</span>
            <span>Project</span>
            <span className="max-md:hidden">Integrity</span>
            <span className="max-md:hidden">Coverage</span>
            <span className="text-right">Score</span>
          </div>
          {summary.entries.map((e) => {
            const s = STATUS[e.status];
            return (
              <Link
                key={`${e.handle}/${e.project}`}
                href={`/l/${e.handle}/${e.project}`}
                className="grid grid-cols-[40px_1fr_180px_120px_90px] items-center gap-4 border-b border-hairline px-6 py-4 transition-colors last:border-b-0 hover:bg-elevated max-md:grid-cols-[32px_1fr_90px]"
              >
                <span className="font-mono text-[13px] text-fg-muted">{e.rank}</span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[14px] text-fg-body">
                    {e.handle}<span className="text-fg-muted">/</span>{e.project}
                  </span>
                  <span className={`mt-1 inline-block rounded-pill border px-2 py-0.5 font-desc text-[11px] font-medium ${s.pill}`}>
                    {e.status}
                  </span>
                </span>
                <span className="max-md:hidden">
                  <span className="flex h-1.5 overflow-hidden rounded-pill bg-hairline">
                    <span className={`${s.bar} h-full rounded-pill`} style={{ width: `${e.integrity}%` }} />
                  </span>
                </span>
                <span className="font-mono text-[13px] tabular-nums text-fg-body max-md:hidden">{e.coverage}%</span>
                <span className={`text-right font-display text-fluid-lg font-semibold tabular-nums ${s.text}`}>{e.score}</span>
              </Link>
            );
          })}
        </div>

        {/* fingerprints */}
        {summary.fingerprints.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-display text-fluid-lg font-semibold">Failure fingerprints</h2>
            <p className="mt-1 font-desc text-[13px] text-fg-muted">Most common failing checks across the season.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {summary.fingerprints.map((f) => (
                <span key={f.signature} className="rounded-pill border border-hairline bg-surface px-3.5 py-1.5 font-mono text-[12px] text-fg-body">
                  {f.signature} <span className="text-negative">×{f.count}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
