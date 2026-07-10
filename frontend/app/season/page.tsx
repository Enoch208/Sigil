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

const CARD = "rounded-2xl border border-white/[0.05] bg-gradient-to-b from-[#15171F] to-[#0F1116] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]";

const STATUS: Record<SeasonEntry["status"], { text: string; bar: string; glow: string; pill: string }> = {
  verified: { text: "text-[#5CC79E]", bar: "bg-gradient-to-r from-[#3EA87D] to-[#5BC295]", glow: "shadow-[0_0_18px_-3px_rgba(91,194,149,0.55)]", pill: "text-[#6FD0AA] border-[#5BC295]/20 bg-[#5BC295]/10" },
  audited: { text: "text-[#E7AC55]", bar: "bg-gradient-to-r from-[#C78A34] to-[#E7AC55]", glow: "shadow-[0_0_18px_-3px_rgba(231,172,85,0.5)]", pill: "text-[#E7AC55] border-[#E7AC55]/20 bg-[#E7AC55]/10" },
  contested: { text: "text-[#DB9090]", bar: "bg-gradient-to-r from-[#BA6767] to-[#DB9090]", glow: "shadow-[0_0_18px_-3px_rgba(219,144,144,0.45)]", pill: "text-[#DB9090] border-[#DB9090]/20 bg-[#DB9090]/10" },
  narrative: { text: "text-zinc-500", bar: "bg-white/[0.14]", glow: "", pill: "text-zinc-400 border-white/[0.06] bg-white/[0.04]" },
};

function StatCard({ icon, label, value, sub, tone }: { icon: typeof Alert01Icon; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className={`${CARD} p-6`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} className={tone ?? "text-zinc-500"} />
      </span>
      <div className="mt-5 font-display text-[30px] font-semibold tracking-tight tabular-nums leading-none text-[#F4F5F7]">{value}</div>
      <div className="mt-2 font-desc text-[12.5px] font-medium text-zinc-400">{label}</div>
      {sub ? <div className={`mt-0.5 font-desc text-[11.5px] ${tone ?? "text-zinc-500"}`}>{sub}</div> : null}
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
    <div className="flex min-h-screen bg-[#090A0C] text-[#F4F5F7] antialiased">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8 max-md:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight">Overview</h1>
            <p className="mt-1.5 font-desc text-[13.5px] text-zinc-400">Season 3 · every entry&apos;s loop, cross-verified and scored.</p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 font-desc text-[12px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5BC295] shadow-[0_0_8px_rgba(91,194,149,0.8)]" />
            <HugeiconsIcon icon={Calendar01Icon} size={13} /> Season 3 · live
          </span>
        </div>

        <div className="mt-7 grid grid-cols-4 gap-4 max-lap:grid-cols-2">
          <StatCard icon={DashboardSquare01Icon} label="Projects indexed" value={String(summary.totals.projects)} />
          <StatCard icon={CheckmarkBadge01Icon} label="Machine-checkable logs" value={`${machineCheckable}/${summary.totals.projects}`} sub="line-by-line" tone="text-[#5CC79E]" />
          <StatCard icon={Analytics01Icon} label="Average integrity" value={`${avgIntegrity}`} />
          <StatCard icon={Alert01Icon} label="Contradicted lines" value={String(summary.totals.contradicted)} tone={summary.totals.contradicted ? "text-[#DB9090]" : "text-zinc-500"} />
        </div>

        <div id="leaderboard" className={`mt-4 scroll-mt-8 ${CARD} p-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">Loop Integrity by project</h2>
            <span className="font-mono text-[11px] text-zinc-600">score · 0–100</span>
          </div>
          <div className="mt-6 space-y-4">
            {summary.entries.map((e) => {
              const s = STATUS[e.status];
              return (
                <Link
                  key={`${e.handle}/${e.project}`}
                  href={`/l/${e.handle}/${e.project}`}
                  className="group grid grid-cols-[200px_1fr_46px] items-center gap-5 max-md:grid-cols-[116px_1fr_40px]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="font-mono text-[11px] text-zinc-600">{String(e.rank).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[12.5px] text-zinc-300 transition-colors group-hover:text-[#F4F5F7]">
                        {e.handle}/{e.project}
                      </span>
                      <span className={`font-desc text-[10.5px] ${s.text}`}>{e.status}</span>
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <span className={`absolute inset-y-0 left-0 rounded-full ${s.bar} ${s.glow}`} style={{ width: `${Math.max(e.score, 2)}%` }} />
                  </div>
                  <span className={`text-right font-display text-[15px] font-semibold tabular-nums ${s.text}`}>{e.score}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-5 max-w-[640px] font-desc text-[12.5px] leading-relaxed text-zinc-500">
          Machine-verifiable logs are scored line-by-line; narrative (prose) logs are marked neutrally — never scored down.
          <Link href="/api/methodology" className="ml-1 text-zinc-400 transition-colors hover:text-zinc-200 hover:underline">How the score is computed →</Link>
        </p>
      </main>

      <DashboardRail summary={summary} spotlight={spotlight} />
    </div>
  );
}
