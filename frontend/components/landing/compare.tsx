"use client";

/** @file compare.tsx - Two-column "Other tools vs Sigil" comparison with an elevated accent card. */
import { cn } from "@/lib/utils/utils";

/** The template's dotted-chevron bullet — a "›" built from five dots. */
function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg width="6" height="9" viewBox="0 0 6 9" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="1.625" cy="1.125" r=".875" />
      <circle cx="3.375" cy="2.875" r=".875" />
      <circle cx="5.125" cy="4.625" r=".875" />
      <circle cx="3.375" cy="6.375" r=".875" />
      <circle cx="1.625" cy="8.125" r=".875" />
    </svg>
  );
}

const OTHER_LABELS = [
  "Trusts the agent's self-report",
  "No cross-check against git history",
  "Screenshots and vibes, not verdicts",
  "“Green” means the agent said so",
  "The log can't prove itself",
];

const SIGIL_LABELS = [
  "Cross-checks three independent sources",
  "Every line carries a SHA + run ID",
  "Per-line: verified / unverifiable",
  "“Green” means CI actually passed",
  "A self-proving LOOP.md",
];

export function Compare() {
  return (
    <section className="relative bg-cream pt-[160px] pb-0 max-md:pt-[80px] max-md:pb-5">
      <div className="mx-auto max-w-[640px] text-left reveal max-md:px-5">
        <h2 className="max-w-[600px] text-[36px] font-medium leading-[43.2px] tracking-[-1.08px] text-ink md:max-lg:max-w-[660px] md:max-lg:text-[32px] md:max-lg:leading-[38.4px] md:max-lg:tracking-[-0.96px] max-md:text-[28px] max-md:leading-[33.6px] max-md:tracking-[-0.84px]">
          Trusting an AI coding loop is hard
          <br className="max-md:hidden" /> when most tools just{" "}
          <span className="text-orange">take the agent&apos;s word for it</span>.
        </h2>

        <p className="mt-10 text-[36px] font-medium leading-[43.2px] tracking-[-1.08px] text-ink md:max-lg:text-[32px] md:max-lg:leading-[38.4px] md:max-lg:tracking-[-0.96px] max-md:mt-5 max-md:text-[28px] max-md:leading-[33.6px] max-md:tracking-[-0.84px]">
          So we made it simple <span className="text-orange">to compare</span> how Sigil verifies{" "}
          <span className="mx-2 inline-flex h-[26px] w-[52px] items-center justify-end rounded-full bg-orange p-[2px] align-middle shadow-[0_1px_5px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] max-md:mx-0">
            <span className="h-[22px] w-[22px] rounded-full bg-accent-ink" />
          </span>{" "}
          versus what every <span className="text-orange">other tool</span> assumes.
        </p>

        <div className="relative mt-[60px] grid grid-cols-[320px_320px] rounded-lg bg-surface max-md:mt-[30px] max-md:grid-cols-1 max-md:pt-5">
          <div className="w-[320px] rounded-lg bg-surface max-md:w-full max-md:pb-2.5">
            <div className="border-b border-hairline px-[30px] pt-5 pb-[19px] max-md:px-4 max-md:pt-4 max-md:pb-[15px]">
              <h2 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px] max-md:leading-[24px] max-md:tracking-[-0.6px]">
                Other tools
              </h2>
            </div>
            {OTHER_LABELS.map((label, i) => (
              <div
                key={label}
                className={cn(
                  "flex items-start gap-[10px] px-[30px] py-4 max-md:px-4 max-md:py-[10px]",
                  i < OTHER_LABELS.length - 1 && "border-b border-dashed border-hairline",
                )}
              >
                <span className="flex shrink-0 pt-1 text-muted-ink">
                  <Chevron />
                </span>
                <span className="text-[16px] font-medium leading-[19.2px] tracking-[0.04px] max-md:text-[15px] max-md:leading-[18px] max-md:tracking-[0.0375px] text-muted-ink">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative w-[320px] max-md:mt-3 max-md:w-full max-md:pb-2.5">
            <div className="absolute top-0 bottom-0 left-0 right-0 z-0 overflow-hidden rounded-lg bg-elevated md:-top-5">
              <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_50%_-10%,rgba(245,165,36,0.22),transparent_60%)]" />
            </div>
            <div className="relative z-[1]">
              <div className="border-b border-hairline px-[30px] pt-5 pb-[19px] max-md:px-4 max-md:pt-4 max-md:pb-[15px]">
                <h2 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px] max-md:leading-[24px] max-md:tracking-[-0.6px]">
                  Sigil
                </h2>
              </div>
              {SIGIL_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-start gap-[10px] px-[30px] py-4 max-md:px-4 max-md:py-[10px]",
                    i < SIGIL_LABELS.length - 1 && "border-b border-dashed border-hairline",
                  )}
                >
                  <span className="flex shrink-0 pt-1 text-orange">
                    <Chevron />
                  </span>
                  <span className="text-[16px] font-medium leading-[19.2px] tracking-[0.04px] max-md:text-[15px] max-md:leading-[18px] max-md:tracking-[0.0375px] text-ink">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
