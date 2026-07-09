import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { CheckmarkCircle01Icon, Alert01Icon, TickDouble01Icon, FingerPrintIcon } from "@hugeicons/core-free-icons";
import type { SeasonSummary, SeasonEntry } from "@/lib/loop";

function ScoreRing({ score, contradicted }: { score: number; contradicted: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const color = contradicted > 0 ? "var(--accent-negative)" : "var(--accent-positive)";
  return (
    <div className="relative grid h-[76px] w-[76px] place-items-center">
      <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
        <circle cx="38" cy="38" r={r} fill="none" stroke="var(--border-hairline)" strokeWidth="6" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <span className="absolute font-display text-[22px] font-semibold tabular-nums">{score}</span>
    </div>
  );
}

export function DashboardRail({ summary, spotlight }: { summary: SeasonSummary; spotlight?: SeasonEntry }) {
  const activity: { icon: IconSvgElement; color: string; text: string; sub: string }[] = [
    { icon: TickDouble01Icon, color: "text-positive", text: "run-verified · 6/6 TestSprite runs", sub: "loopscope/sigil" },
  ];
  for (const e of summary.entries) {
    if (e.status === "verified") {
      activity.push({ icon: CheckmarkCircle01Icon, color: "text-positive", text: `${e.handle}/${e.project} verified`, sub: `integrity ${e.integrity}` });
    } else if (e.status === "contested") {
      activity.push({ icon: Alert01Icon, color: "text-negative", text: `contradiction · ${e.handle}/${e.project}`, sub: `${e.contradicted} line${e.contradicted > 1 ? "s" : ""}` });
    } else {
      activity.push({ icon: FingerPrintIcon, color: "text-fg-muted", text: `${e.handle}/${e.project} narrative`, sub: "not machine-checkable" });
    }
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[336px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-hairline bg-page px-6 py-7 max-lg:hidden">
      {/* spotlight */}
      {spotlight ? (
        <div className="rounded-xl border border-hairline bg-surface p-5 shadow-card">
          <div className="font-desc text-[11px] uppercase tracking-[0.14em] text-fg-muted">Self-proving loop</div>
          <div className="mt-3 flex items-center gap-4">
            <ScoreRing score={spotlight.score} contradicted={spotlight.contradicted} />
            <div>
              <div className="font-mono text-[13px] text-fg-body">{spotlight.handle}/{spotlight.project}</div>
              <div className="mt-1 font-desc text-[12px] text-positive">verified · integrity {spotlight.integrity}</div>
              <div className="font-desc text-[12px] text-fg-muted">CI-gated · run-verified</div>
            </div>
          </div>
          <Link href={`/l/${spotlight.handle}/${spotlight.project}`} className="mt-4 block rounded-md border border-hairline bg-elevated py-2 text-center font-desc text-[12.5px] font-medium text-fg-primary transition-colors hover:border-strong">
            Open loop
          </Link>
        </div>
      ) : null}

      {/* fingerprints */}
      <div id="fingerprints">
        <div className="flex items-center gap-2 font-display text-[15px] font-semibold">
          <HugeiconsIcon icon={FingerPrintIcon} size={16} className="text-accent" /> Failure fingerprints
        </div>
        {summary.fingerprints.length ? (
          <div className="mt-3 space-y-1.5">
            {summary.fingerprints.map((f) => (
              <div key={f.signature} className="flex items-center justify-between rounded-md border border-hairline bg-surface px-3 py-2">
                <span className="font-mono text-[12px] text-fg-body">{f.signature}</span>
                <span className="font-mono text-[12px] text-negative">×{f.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 font-desc text-[12px] text-fg-muted">No failing checks across the field.</p>
        )}
      </div>

      {/* activity */}
      <div>
        <div className="font-display text-[15px] font-semibold">Activity</div>
        <div className="mt-3 space-y-3.5">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-hairline bg-surface">
                <HugeiconsIcon icon={a.icon} size={14} className={a.color} />
              </span>
              <div className="min-w-0">
                <div className="truncate font-desc text-[13px] text-fg-body">{a.text}</div>
                <div className="font-mono text-[11px] text-fg-muted">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
