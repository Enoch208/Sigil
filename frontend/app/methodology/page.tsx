import Link from "next/link";
import { getMethodology } from "@/lib/loop";
import type { Verdict } from "@/lib/loop";
import { DashboardSidebar } from "@/components/app/dashboard-sidebar";

const CARD = "rounded-2xl border border-white/[0.05] bg-gradient-to-b from-[#15171F] to-[#0F1116] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]";

const VERDICT_DOT: Record<Verdict, string> = {
  verified: "bg-[#5BC295]",
  "verdict-mismatch": "bg-[#E7AC55]",
  contradicted: "bg-[#DB9090]",
  unverifiable: "bg-zinc-600",
};

export default function MethodologyPage() {
  const doc = getMethodology();

  return (
    <div className="flex min-h-screen bg-[#090A0C] text-[#F4F5F7] antialiased">
      <DashboardSidebar active="methodology" />

      <main className="mx-auto min-w-0 max-w-[880px] flex-1 overflow-y-auto px-8 py-8 max-md:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight">Methodology</h1>
            <p className="mt-1.5 max-w-[600px] font-desc text-[13.5px] leading-relaxed text-zinc-400">
              How Sigil turns a <span className="font-mono text-zinc-300">LOOP.md</span> into a score. Every number below is
              read straight from the engine, so this page can never drift from the code that runs.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono text-[11.5px] text-zinc-400">
            v{doc.version}
          </span>
        </div>

        <h2 className="mt-10 font-display text-[15px] font-semibold tracking-tight">The formula</h2>
        <div className="mt-4 grid grid-cols-3 gap-4 max-md:grid-cols-1">
          {[
            { label: "Coverage", formula: doc.formulas.coverage },
            { label: "Integrity", formula: doc.formulas.integrity },
            { label: "Score", formula: doc.formulas.score },
          ].map((f) => (
            <div key={f.label} className={`${CARD} p-5`}>
              <div className="font-desc text-[10.5px] font-medium uppercase tracking-[0.14em] text-zinc-500">{f.label}</div>
              <div className="mt-2.5 font-mono text-[12.5px] leading-relaxed text-zinc-200">{f.formula}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[680px] font-desc text-[12.5px] leading-relaxed text-zinc-500">
          A contradicted line costs {doc.penaltyPerContradiction} points each — the only thing that pulls a proven log below
          its integrity ceiling.
        </p>

        <h2 className="mt-11 font-display text-[15px] font-semibold tracking-tight">Per-line verdicts</h2>
        <div className={`mt-4 overflow-hidden ${CARD}`}>
          {doc.verdicts.map((v) => (
            <div key={v.verdict} className="flex items-start gap-3.5 border-b border-white/[0.05] px-5 py-4 last:border-b-0">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${VERDICT_DOT[v.verdict]}`} aria-hidden />
              <div className="min-w-0">
                <div className="font-desc text-[13px] font-medium text-zinc-200">{v.label}</div>
                <p className="mt-1 font-desc text-[12.5px] leading-relaxed text-zinc-500">{v.meaning}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-11 font-display text-[15px] font-semibold tracking-tight">Cross-checks</h2>
        <p className="mt-1 font-desc text-[12.5px] text-zinc-500">
          Each machine-checkable line is run through every applicable check against git and TestSprite run history.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 max-md:grid-cols-1">
          {doc.checks.map((c) => (
            <div key={c.check} className={`${CARD} px-4 py-3.5`}>
              <div className="font-mono text-[12px] text-zinc-300">{c.check}</div>
              <p className="mt-1 font-desc text-[12px] leading-relaxed text-zinc-500">{c.description}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-11 font-display text-[15px] font-semibold tracking-tight">Principles</h2>
        <ul className="mt-4 space-y-3">
          {doc.notes.map((n, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" aria-hidden />
              <span className="font-desc text-[12.5px] leading-relaxed text-zinc-400">{n}</span>
            </li>
          ))}
        </ul>

        <div className="mt-11 flex items-center justify-between border-t border-white/[0.05] pt-6 font-desc text-[12.5px] text-zinc-500">
          <Link href="/season" className="transition-colors hover:text-zinc-200 hover:underline">← Season Index</Link>
          <a href="/api/methodology" className="font-mono text-[11.5px] transition-colors hover:text-zinc-300 hover:underline">JSON →</a>
        </div>
      </main>
    </div>
  );
}
