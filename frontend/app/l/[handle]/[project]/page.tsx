import Link from "next/link";
import { notFound } from "next/navigation";
import { audit, grade } from "@/lib/loop";
import type { Verdict } from "@/lib/loop";
import { getProjectSources } from "@/lib/loop/fixtures/registry";
import { DashboardSidebar } from "@/components/app/dashboard-sidebar";

const CARD = "rounded-2xl border border-white/[0.06] bg-[#12141C] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]";

const VERDICT: Record<Verdict, { dot: string; text: string; label: string }> = {
  verified: { dot: "bg-[#5BC295]", text: "text-[#5CC79E]", label: "verified" },
  "verdict-mismatch": { dot: "bg-[#E7AC55]", text: "text-[#E7AC55]", label: "verdict mismatch" },
  contradicted: { dot: "bg-[#DB9090]", text: "text-[#DB9090]", label: "contradicted" },
  unverifiable: { dot: "bg-zinc-600", text: "text-zinc-500", label: "unverifiable" },
};

function status(score: number, contradicted: number, checkable: number) {
  if (checkable === 0) return { label: "narrative", cls: "text-zinc-400 border-white/[0.06] bg-white/[0.03]" };
  if (contradicted > 0) return { label: "contested", cls: "text-[#DB9090] border-[#DB9090]/20 bg-[#DB9090]/10" };
  if (score >= 95) return { label: "verified", cls: "text-[#5CC79E] border-[#5BC295]/20 bg-[#5BC295]/10" };
  return { label: "audited", cls: "text-[#E7AC55] border-[#E7AC55]/20 bg-[#E7AC55]/10" };
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="font-desc text-[10.5px] font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-2 font-display text-[26px] font-semibold tracking-tight tabular-nums text-[#F4F5F7]">{value}</div>
      {sub ? <div className="mt-0.5 font-desc text-[11.5px] text-zinc-500">{sub}</div> : null}
    </div>
  );
}

export default async function LoopPage({
  params,
}: {
  params: Promise<{ handle: string; project: string }>;
}) {
  const { handle, project } = await params;
  const sources = getProjectSources(handle, project);
  if (!sources) notFound();

  const { report, timeline } = audit(sources);
  const s = report.score;
  const st = status(s.score, s.contradicted, s.checkable);
  const ring = 2 * Math.PI * 52;
  const ringColor = s.contradicted > 0 ? "#DB9090" : "#5BC295";
  const avgTtg = timeline.timeToGreen.length
    ? Math.round(timeline.timeToGreen.reduce((a, t) => a + t.ms, 0) / timeline.timeToGreen.length / 1000)
    : null;

  return (
    <div className="flex min-h-screen bg-[#090A0C] text-[#F4F5F7] antialiased">
      <DashboardSidebar />

      <main className="mx-auto min-w-0 max-w-[880px] flex-1 overflow-y-auto px-8 py-8 max-md:px-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/season" className="font-mono text-[12.5px] text-zinc-500 transition-colors hover:text-zinc-300">← Season Index</Link>
          <span className={`rounded-full border px-3 py-1 font-desc text-[11.5px] font-medium ${st.cls}`}>{st.label}</span>
        </div>

        <h1 className="mt-7 font-mono text-[18px] text-zinc-300">
          {handle}<span className="text-zinc-600">/</span>{project}
        </h1>
        <p className="mt-1.5 max-w-[560px] font-desc text-[13.5px] leading-relaxed text-zinc-500">
          Loop Integrity — every line cross-checked against git and TestSprite runs by Sigil&apos;s own engine.
        </p>

        <div className={`mt-7 flex items-center gap-8 ${CARD} p-8 max-md:flex-col max-md:items-start max-md:gap-6`}>
          <div className="relative grid h-[130px] w-[130px] shrink-0 place-items-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={ringColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - s.score / 100)} style={{ filter: `drop-shadow(0 0 6px ${ringColor}66)` }} />
            </svg>
            <div className="absolute grid place-items-center">
              <span className="font-display text-[38px] font-semibold tabular-nums leading-none">{s.score}</span>
              <span className="mt-1 font-desc text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">integrity</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[24px] font-semibold tracking-tight text-[#E7AC55]">{grade(s.score)}</span>
              <span className="font-desc text-[12.5px] text-zinc-500">grade</span>
            </div>
            <p className="mt-2 font-desc text-[13.5px] leading-relaxed text-zinc-300">
              {s.verified} of {s.total} lines verified · {s.contradicted} contradicted · coverage {s.coverage}%.
              {s.contradicted === 0 ? " This log proves itself." : " One or more lines could not be proven."}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/l/${handle}/${project}/badge.svg`} alt="Loop Integrity badge" className="mt-4 h-5" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <Stat label="Coverage" value={`${s.coverage}%`} sub="machine-checkable" />
          <Stat label="Iterations" value={String(timeline.iterations)} sub={`${timeline.banked} banked`} />
          <Stat label="Time to green" value={avgTtg === null ? "—" : `${avgTtg}s`} sub="avg per failure" />
          <Stat label="Red streak" value={String(timeline.longestRedStreak)} sub="longest" />
        </div>

        <h2 className="mt-11 font-display text-[18px] font-semibold tracking-tight">Loop replay</h2>
        <p className="mt-1 font-desc text-[12.5px] text-zinc-500">{timeline.events.length} iterations, narrated by their own LOOP.md lines.</p>
        <ol className={`mt-5 overflow-hidden ${CARD}`}>
          {report.verdicts.map((v, i) => {
            const vs = VERDICT[v.verdict];
            return (
              <li key={i} className="flex items-start gap-3 border-b border-white/[0.05] px-5 py-3.5 last:border-b-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${vs.dot}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-zinc-500">{v.line.testId ?? "—"}</span>
                    <span className={`font-desc text-[10.5px] font-medium ${vs.text}`}>{vs.label}</span>
                  </div>
                  {v.line.description ? <div className="mt-0.5 truncate font-desc text-[13px] text-zinc-300">{v.line.description}</div> : null}
                </div>
                <div className="shrink-0 text-right font-mono text-[10.5px] text-zinc-600">
                  {v.line.commitSha ? <div>{v.line.commitSha.slice(0, 7)}</div> : null}
                  {v.line.runId ? <div className="opacity-70">{v.line.runId.slice(0, 8)}</div> : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex items-center justify-between font-desc text-[12.5px] text-zinc-500">
          <a href="/api/methodology" className="transition-colors hover:text-[#E7AC55]">How the score is computed →</a>
          <Link href="/season" className="transition-colors hover:text-[#E7AC55]">Season Index →</Link>
        </div>
      </main>
    </div>
  );
}
