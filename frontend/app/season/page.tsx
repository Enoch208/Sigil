import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  CheckmarkBadge01Icon,
  Analytics01Icon,
  Alert01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { audit, aggregateSeason } from "@/lib/loop";
import type { SeasonEntry } from "@/lib/loop";
import { listProjects } from "@/lib/loop/fixtures/registry";
import { DashboardSidebar } from "@/components/app/dashboard-sidebar";
import { DashboardRail } from "@/components/app/dashboard-rail";

const STATUS: Record<SeasonEntry["status"], { text: string; bar: string; pill: string }> = {
  verified: { text: "text-positive", bar: "bg-positive", pill: "text-positive border-positive/40 bg-positive-bg" },
  audited: { text: "text-accent", bar: "bg-accent", pill: "text-accent border-accent/40 bg-accent-bg" },
  contested: { text: "text-negative", bar: "bg-negative", pill: "text-negative border-negative/40 bg-negative-bg" },
  narrative: { text: "text-fg-muted", bar: "bg-fg-muted/50", pill: "text-fg-muted border-hairline" },
};

function StatCard({ icon, label, value, sub, tone }: { icon: typeof Alert01Icon; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 shadow-card">
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-hairline bg-elevated">
        <HugeiconsIcon icon={icon} size={17} strokeWidth={1.8} className={tone ?? "text-fg-muted"} />
      </span>
      <div className="mt-4 font-display text-fluid-3xl font-semibold tabular-nums leading-none">{value}</div>
      <div className="mt-1.5 font-desc text-[12.5px] text-fg-muted">{label}</div>
      {sub ? <div className="mt-0.5 font-desc text-[12px] text-positive">{sub}</div> : null}
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
  const avgIntegrity = summary.entries.length
    ? Math.round(summary.entries.reduce((a, e) => a + e.integrity, 0) / summary.entries.length)
    : 0;
  const spotlight = summary.entries.find((e) => e.status === "verified") ?? summary.entries[0];

  return (
    <div className="flex min-h-screen bg-page text-fg-primary">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7 max-md:px-5">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-fluid-3xl font-semibold tracking-tight">Overview</h1>
            <p className="mt-1.5 font-desc text-[13.5px] text-fg-muted">Season 3 · every entry&apos;s loop, cross-verified and scored.</p>
          </div>
          <span className="flex items-center gap-2 rounded-pill border border-hairline bg-surface px-3.5 py-1.5 font-desc text-[12.5px] text-fg-muted">
            <HugeiconsIcon icon={Calendar01Icon} size={14} /> Season 3 · live
          </span>
        </div>

        {/* stat cards */}
        <div className="mt-6 grid grid-cols-4 gap-4 max-lap:grid-cols-2">
          <StatCard icon={DashboardSquare01Icon} label="Projects indexed" value={String(summary.totals.projects)} />
          <StatCard icon={CheckmarkBadge01Icon} label="Machine-checkable logs" value={`${machineCheckable}/${summary.totals.projects}`} sub="line-by-line" tone="text-positive" />
          <StatCard icon={Analytics01Icon} label="Average integrity" value={`${avgIntegrity}`} tone="text-accent" />
          <StatCard icon={Alert01Icon} label="Contradicted lines" value={String(summary.totals.contradicted)} tone={summary.totals.contradicted ? "text-negative" : "text-fg-muted"} />
        </div>

        {/* bar chart / leaderboard */}
        <div id="leaderboard" className="mt-6 rounded-xl border border-hairline bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold">Loop Integrity by project</h2>
            <span className="font-desc text-[12px] text-fg-muted">score · 0–100</span>
          </div>
          {/* axis */}
          <div className="mt-5 grid grid-cols-[220px_1fr_44px] gap-4 pb-2 font-mono text-[10.5px] text-fg-hint max-md:grid-cols-[120px_1fr_40px]">
            <span />
            <span className="flex justify-between"><span>0</span><span>50</span><span>100</span></span>
            <span />
          </div>
          <div className="space-y-3.5">
            {summary.entries.map((e) => {
              const s = STATUS[e.status];
              return (
                <Link
                  key={`${e.handle}/${e.project}`}
                  href={`/l/${e.handle}/${e.project}`}
                  className="group grid grid-cols-[220px_1fr_44px] items-center gap-4 max-md:grid-cols-[120px_1fr_40px]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="font-mono text-[12px] text-fg-hint">{e.rank}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[12.5px] text-fg-body transition-colors group-hover:text-fg-primary">
                        {e.handle}/{e.project}
                      </span>
                      <span className={`font-desc text-[11px] ${s.text}`}>{e.status}</span>
                    </span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-pill bg-hairline">
                    <span className="absolute inset-y-0 left-1/2 w-px bg-white/[0.05]" />
                    <span className={`absolute inset-y-0 left-0 rounded-pill ${s.bar} transition-[width]`} style={{ width: `${Math.max(e.score, 2)}%` }} />
                  </div>
                  <span className={`text-right font-display text-[15px] font-semibold tabular-nums ${s.text}`}>{e.score}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-6 font-desc text-[12.5px] leading-relaxed text-fg-muted">
          Machine-verifiable logs are scored line-by-line; narrative (prose) logs are marked neutrally — never scored down.
          <Link href="/api/methodology" className="ml-1 text-accent transition-opacity hover:opacity-80">How the score is computed →</Link>
        </p>
      </main>

      <DashboardRail summary={summary} spotlight={spotlight} />
    </div>
  );
}
