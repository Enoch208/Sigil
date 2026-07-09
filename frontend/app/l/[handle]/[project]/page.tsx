import { notFound } from "next/navigation";
import { audit, grade } from "@/lib/loop";
import type { Verdict } from "@/lib/loop";
import { getProjectSources } from "@/lib/loop/fixtures/registry";
import { AppNav } from "@/components/app/app-nav";

const VERDICT: Record<Verdict, { dot: string; text: string; label: string }> = {
  verified: { dot: "bg-positive", text: "text-positive", label: "verified" },
  "verdict-mismatch": { dot: "bg-accent", text: "text-accent", label: "verdict mismatch" },
  contradicted: { dot: "bg-negative", text: "text-negative", label: "contradicted" },
  unverifiable: { dot: "bg-fg-muted", text: "text-fg-muted", label: "unverifiable" },
};

function status(score: number, contradicted: number, checkable: number) {
  if (checkable === 0) return { label: "narrative", cls: "text-fg-muted border-hairline" };
  if (contradicted > 0) return { label: "contested", cls: "text-negative border-negative/40 bg-negative-bg" };
  if (score >= 95) return { label: "verified", cls: "text-positive border-positive/40 bg-positive-bg" };
  return { label: "audited", cls: "text-accent border-accent/40 bg-accent-bg" };
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-5 shadow-card">
      <div className="font-desc text-[11px] uppercase tracking-[0.14em] text-fg-muted">{label}</div>
      <div className="mt-1.5 font-display text-fluid-3xl font-semibold tabular-nums text-fg-primary">{value}</div>
      {sub ? <div className="mt-0.5 font-desc text-[12px] text-fg-muted">{sub}</div> : null}
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
  const avgTtg = timeline.timeToGreen.length
    ? Math.round(timeline.timeToGreen.reduce((a, t) => a + t.ms, 0) / timeline.timeToGreen.length / 1000)
    : null;

  return (
    <div className="min-h-screen bg-page text-fg-primary">
      <AppNav />
      <main className="mx-auto max-w-[920px] px-6 py-14 max-md:py-9">
        {/* header */}
        <div className="flex items-center justify-between gap-4">
          <a href="/season" className="font-mono text-[13px] text-fg-muted transition-colors hover:text-fg-body">
            ← Season Index
          </a>
          <span className={`rounded-pill border px-3 py-1 font-desc text-[12px] font-medium ${st.cls}`}>
            {st.label}
          </span>
        </div>

        <h1 className="mt-8 font-mono text-fluid-lg text-fg-body">
          {handle}<span className="text-fg-muted">/</span>{project}
        </h1>
        <p className="mt-2 max-w-[560px] font-desc text-[14px] leading-relaxed text-fg-muted">
          Loop Integrity — every line cross-checked against git and TestSprite runs by Sigil&apos;s own engine.
        </p>

        {/* score hero */}
        <div className="mt-8 flex items-center gap-8 rounded-xl border border-hairline bg-surface p-8 shadow-card max-md:flex-col max-md:items-start max-md:gap-6">
          <div className="relative grid h-[132px] w-[132px] shrink-0 place-items-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-hairline)" strokeWidth="9" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={s.contradicted > 0 ? "var(--accent-negative)" : "var(--accent-positive)"}
                strokeWidth="9" strokeLinecap="round"
                strokeDasharray={ring} strokeDashoffset={ring * (1 - s.score / 100)}
              />
            </svg>
            <div className="absolute grid place-items-center">
              <span className="font-display text-[40px] font-semibold tabular-nums leading-none">{s.score}</span>
              <span className="mt-1 font-desc text-[11px] uppercase tracking-[0.16em] text-fg-muted">integrity</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-fluid-2xl font-semibold text-accent">{grade(s.score)}</span>
              <span className="font-desc text-[13px] text-fg-muted">grade</span>
            </div>
            <p className="mt-2 font-desc text-[14px] leading-relaxed text-fg-body">
              {s.verified} of {s.total} lines verified · {s.contradicted} contradicted · coverage {s.coverage}%.
              {s.contradicted === 0 ? " This log proves itself." : " One or more lines could not be proven."}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/l/${handle}/${project}/badge.svg`}
              alt="Loop Integrity badge"
              className="mt-4 h-5"
            />
          </div>
        </div>

        {/* stat tiles */}
        <div className="mt-5 grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <Stat label="Coverage" value={`${s.coverage}%`} sub="machine-checkable" />
          <Stat label="Iterations" value={String(timeline.iterations)} sub={`${timeline.banked} banked`} />
          <Stat label="Time to green" value={avgTtg === null ? "—" : `${avgTtg}s`} sub="avg per failure" />
          <Stat label="Red streak" value={String(timeline.longestRedStreak)} sub="longest" />
        </div>

        {/* loop replay */}
        <h2 className="mt-12 font-display text-fluid-xl font-semibold">Loop replay</h2>
        <p className="mt-1 font-desc text-[13px] text-fg-muted">
          {timeline.events.length} iterations, narrated by their own LOOP.md lines.
        </p>
        <ol className="mt-5 space-y-px overflow-hidden rounded-lg border border-hairline bg-surface shadow-card">
          {report.verdicts.map((v, i) => {
            const vs = VERDICT[v.verdict];
            return (
              <li key={i} className="flex items-start gap-3 border-b border-hairline px-5 py-3.5 last:border-b-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${vs.dot}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-fg-muted">{v.line.testId ?? "—"}</span>
                    <span className={`font-desc text-[11px] font-medium ${vs.text}`}>{vs.label}</span>
                  </div>
                  {v.line.description ? (
                    <div className="mt-0.5 truncate font-desc text-[13px] text-fg-body">{v.line.description}</div>
                  ) : null}
                </div>
                <div className="shrink-0 text-right font-mono text-[11px] text-fg-muted">
                  {v.line.commitSha ? <div>{v.line.commitSha.slice(0, 7)}</div> : null}
                  {v.line.runId ? <div className="opacity-70">{v.line.runId.slice(0, 8)}</div> : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex items-center justify-between font-desc text-[13px] text-fg-muted">
          <a href="/api/methodology" className="transition-colors hover:text-accent">How the score is computed →</a>
          <a href="/season" className="transition-colors hover:text-accent">Season Index →</a>
        </div>
      </main>
    </div>
  );
}
