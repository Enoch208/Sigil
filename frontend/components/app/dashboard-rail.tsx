import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { CheckmarkCircle01Icon, Alert01Icon, TickDouble01Icon, FingerPrintIcon } from "@hugeicons/core-free-icons";
import type { SeasonSummary, SeasonEntry } from "@/lib/loop";

function ScoreRing({ score, contradicted }: { score: number; contradicted: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const color = contradicted > 0 ? "#DB9090" : "#5BC295";
  return (
    <div className="relative grid h-[74px] w-[74px] place-items-center">
      <svg viewBox="0 0 74 74" className="h-full w-full -rotate-90">
        <circle cx="37" cy="37" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx="37" cy="37" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ filter: `drop-shadow(0 0 5px ${color}66)` }} />
      </svg>
      <span className="absolute font-display text-[21px] font-semibold tabular-nums">{score}</span>
    </div>
  );
}

export function DashboardRail({ summary, spotlight }: { summary: SeasonSummary; spotlight?: SeasonEntry }) {
  const activity: { icon: IconSvgElement; color: string; text: string; sub: string }[] = [
    { icon: TickDouble01Icon, color: "text-[#5CC79E]", text: "run-verified · 6/6 TestSprite runs", sub: "loopscope/sigil" },
  ];
  for (const e of summary.entries) {
    if (e.status === "verified") {
      activity.push({ icon: CheckmarkCircle01Icon, color: "text-[#5CC79E]", text: `${e.handle}/${e.project} verified`, sub: `integrity ${e.integrity}` });
    } else if (e.status === "contested") {
      activity.push({ icon: Alert01Icon, color: "text-[#DB9090]", text: `contradiction · ${e.handle}/${e.project}`, sub: `${e.contradicted} line${e.contradicted > 1 ? "s" : ""}` });
    } else {
      activity.push({ icon: FingerPrintIcon, color: "text-zinc-500", text: `${e.handle}/${e.project} narrative`, sub: "not machine-checkable" });
    }
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[340px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/[0.06] bg-[#090A0C] px-6 py-8 max-lg:hidden">
      {spotlight ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#12141C] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="font-desc text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Self-proving loop</div>
          <div className="mt-4 flex items-center gap-4">
            <ScoreRing score={spotlight.score} contradicted={spotlight.contradicted} />
            <div>
              <div className="font-mono text-[12.5px] text-zinc-300">{spotlight.handle}/{spotlight.project}</div>
              <div className="mt-1 font-desc text-[12px] text-[#5CC79E]">verified · integrity {spotlight.integrity}</div>
              <div className="font-desc text-[12px] text-zinc-500">CI-gated · run-verified</div>
            </div>
          </div>
          <Link href={`/l/${spotlight.handle}/${spotlight.project}`} className="mt-4 block rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 text-center font-desc text-[12px] font-medium text-zinc-200 transition-colors hover:bg-white/[0.06]">
            Open loop
          </Link>
        </div>
      ) : null}

      <div id="fingerprints">
        <div className="flex items-center gap-2 font-display text-[14px] font-semibold tracking-tight">
          <HugeiconsIcon icon={FingerPrintIcon} size={15} className="text-[#E7AC55]" /> Failure fingerprints
        </div>
        {summary.fingerprints.length ? (
          <div className="mt-3 space-y-1.5">
            {summary.fingerprints.map((f) => (
              <div key={f.signature} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#12141C] px-3.5 py-2">
                <span className="font-mono text-[11.5px] text-zinc-400">{f.signature}</span>
                <span className="font-mono text-[11.5px] text-[#DB9090]">×{f.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 font-desc text-[12px] text-zinc-500">No failing checks across the field.</p>
        )}
      </div>

      <div>
        <div className="font-display text-[14px] font-semibold tracking-tight">Activity</div>
        <div className="mt-3.5 space-y-3.5">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                <HugeiconsIcon icon={a.icon} size={13} className={a.color} />
              </span>
              <div className="min-w-0">
                <div className="truncate font-desc text-[12.5px] text-zinc-300">{a.text}</div>
                <div className="font-mono text-[10.5px] text-zinc-600">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
