/** @file cta.tsx - "Claim your badge" CTA banner with a live proof mini-card. */
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GitBranchIcon } from "@hugeicons/core-free-icons";

const PRIMARY_SHADOW = "0 0 0 1px #b9791a, inset 0 1.4px 1px rgba(255,255,255,.28), 0 8px 22px -8px rgba(245,165,36,.5)";

function SigilMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.4 3.6V7h-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Cta() {
  return (
    <section id="claim" className="relative">
      <div className="relative z-10 mx-auto w-full max-w-[1060px] px-[30px] max-md:px-5">
        <div className="rounded-[16px] bg-soft-2 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_6px_0_rgba(0,0,0,0.55)] reveal">
          <div className="relative flex items-center gap-[50px] overflow-clip rounded-[8px] bg-surface p-[50px] shadow-card max-lg:flex-col max-lg:items-stretch max-lg:gap-8 max-lg:p-8 max-md:gap-6 max-md:p-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_12%_-10%,rgba(245,165,36,0.16),transparent_60%)]"
            />

            <div className="relative z-10 flex w-[450px] flex-col items-start gap-[30px] max-lg:w-full max-md:gap-5">
              <div className="flex flex-col gap-2.5">
                <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-orange">
                  Prove your loop
                </span>
                <h2 className="text-balance text-[52px] font-medium leading-[62.4px] tracking-[-1.56px] text-ink md:max-lg:text-[40px] md:max-lg:leading-[48px] md:max-lg:tracking-[-1.2px] max-md:text-[28px] max-md:leading-[33.6px] max-md:tracking-[-0.84px]">
                  Claim your badge.
                </h2>
                <p className="font-desc mt-1 max-w-[420px] text-[16px] leading-[1.5] text-muted-ink">
                  Turn your loop into a public, verifiable record — a README badge and a proof page at{" "}
                  <span className="font-mono text-[13px] text-ink">loopscope.app/l/&#123;you&#125;</span>.
                </p>
              </div>
            </div>

            <div className="relative z-10 ml-auto w-[360px] shrink-0 rounded-[8px] bg-soft-2 p-2 max-lg:ml-0 max-lg:w-full">
              <div className="flex flex-col gap-5 rounded-[8px] bg-surface p-5 shadow-[0_0_6px_0_rgba(0,0,0,0.55)] max-md:gap-2.5 max-md:p-4">
                <div className="flex items-center gap-2 pl-0.5">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="status-ping absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-positive" />
                    <span className="relative h-2 w-2 rounded-full bg-positive" />
                  </span>
                  <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">Live on GitHub</span>
                </div>

                <div className="flex items-center gap-3" aria-label="Loop verified from repo to badge">
                  <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-hairline bg-elevated text-muted-ink">
                    <HugeiconsIcon icon={GitBranchIcon} size={22} strokeWidth={1.7} />
                  </span>

                  <span className="relative flex h-[50px] flex-1 items-center">
                    <span className="h-px w-full bg-hairline" />
                    <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange text-accent-ink">
                      <SigilMark className="h-4 w-4" />
                    </span>
                  </span>

                  <span className="inline-flex items-stretch overflow-hidden rounded-[6px] border border-hairline font-mono text-[11px]">
                    <span className="flex items-center bg-elevated px-2 py-1 text-muted-ink">loop</span>
                    <span className="flex items-center bg-positive-bg px-2 py-1 font-medium text-positive">98</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-balance text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px] max-md:leading-[24px] max-md:tracking-[-0.6px]">
                    Verified and ready to publish
                  </h3>
                  <p className="text-[16px] font-medium leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:text-[15px] max-md:leading-[18px] max-md:tracking-[0.0375px]">
                    Connect a repo and Sigil scores the loop from three sources — no self-report.
                  </p>
                </div>

                <Link
                  href="#claim"
                  className="block w-full rounded-none bg-orange py-[10px] text-center text-[16px] font-medium leading-[19.2px] tracking-[0.04px] text-accent-ink max-md:text-[15px] max-md:leading-[18px] max-md:tracking-[0.0375px]"
                  style={{ boxShadow: PRIMARY_SHADOW }}
                >
                  Claim Your Badge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
