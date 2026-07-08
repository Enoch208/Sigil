"use client";

/** @file steps.tsx - Scroll-driven sticky process stepper with rotating number dial. */
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { useState, useEffect, useRef } from "react";

const steps: { title: string; desc: string; tags: string[] }[] = [
  {
    title: "Plan",
    desc: "Write the plan file first. No implementation before a failing test exists.",
    tags: ["Plan file"],
  },
  {
    title: "Red",
    desc: "Create the failing test and confirm it fails for the expected reason.",
    tags: ["Failing test", "Expected red"],
  },
  {
    title: "Implement",
    desc: "Build straight from the failure bundle — the exact assertion that is red.",
    tags: ["From the red"],
  },
  {
    title: "Green",
    desc: "Rerun. A pass banks the behavior permanently into the suite.",
    tags: ["Rerun", "Banked"],
  },
  {
    title: "Commit",
    desc: "The commit carries the run ID, so the LOOP.md line proves itself.",
    tags: ["SHA", "Run ID"],
  },
];

const STEP_SHADOW = "0 0 0 1px #b9791a, inset 0 1.4px 1px rgba(255,255,255,0.12), 0 1.4px 4px rgba(0, 0, 0,0.3)";

export function Steps() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [mActive, setMActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const N = steps.length;
    const TAIL = 758;
    const LEAD = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const drive = Math.max(1, el.offsetHeight - TAIL);
        const s = -el.getBoundingClientRect().top;
        const p = (s + LEAD) / drive;
        setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N))));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative bg-cream h-[calc(500vh+758px)] pt-[160px] md:max-lg:h-[calc(450vh+758px)] max-md:h-auto max-md:pt-0"
    >
      <div className="sticky top-[178px] h-[580px] overflow-clip flex flex-col items-center max-md:hidden">
        <div className="flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
          <span className="h-1 w-1 rounded-full bg-orange" />
          <span>How it works</span>
          <span className="h-1 w-1 rounded-full bg-orange" />
        </div>
        <h2 className="mt-4 text-[52px] font-medium leading-[62.4px] tracking-[-1.56px] text-ink text-center md:max-lg:text-[40px] md:max-lg:leading-[48px] md:max-lg:tracking-[-1.2px] max-md:text-[36px]">
          From plan to green
        </h2>

        <div
          aria-hidden
          className="absolute left-1/2 top-[168px] z-0 h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-soft p-3 shadow-[inset_0_0_6px_0_rgba(0, 0, 0,0.18)]"
        >
          <div className="h-full w-full rounded-full border border-white bg-soft" />
        </div>
        <div aria-hidden className="absolute left-1/2 top-[438px] z-0 h-[222px] w-[1440px] -translate-x-1/2 bg-cream blur-[35px]" />

        <div
          className="absolute left-1/2 top-[768px] z-10"
          style={{ transform: `rotate(${-active * 45}deg)`, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {steps.map((_, i) => (
            <div key={i} className="absolute h-0 w-0" style={{ transform: `rotate(${i * 45}deg) translateY(-594px)` }}>
              <div
                className={cn(
                  "absolute -left-[22px] -top-[22px] flex h-11 w-11 items-center justify-center rounded-[8px] bg-surface shadow-[0_2.5px_6px_rgba(0, 0, 0,0.1)] transition-opacity duration-500",
                  i === active ? "opacity-0" : "opacity-100",
                )}
              >
                <span className="text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-muted-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-20 mt-[44px] md:max-lg:mt-[58px] flex flex-col items-center gap-1.5">
          <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">Step</span>
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-orange text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-accent-ink">
            {String(active + 1).padStart(2, "0")}
          </div>
        </div>

        <div className="relative z-10 mt-[84px] w-[360px]">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-x-0 top-0 text-center transition-opacity duration-500",
                i === active ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <h3 className="text-[28px] font-medium leading-[33.6px] tracking-[-0.84px] text-ink text-center">{step.title}</h3>
              <p className="font-desc mt-1.5 text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink text-center">
                {step.desc}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3.5 border-y border-dashed border-hairline py-[19px] text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
                {step.tags.map((tag, t) => (
                  <span key={t} className="flex items-center gap-3.5">
                    {t > 0 && <span className="h-1 w-1 rounded-full bg-muted-ink" />}
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
              <Link
                href="#claim"
                className="mt-5 inline-block bg-orange text-accent-ink rounded-none px-[22px] py-[10px] text-[16px] leading-[19.2px] tracking-[0.04px] font-medium"
                style={{ boxShadow: STEP_SHADOW }}
              >
                Claim Your Badge
              </Link>
              <div className="mt-[50px] flex flex-col items-center gap-2.5">
                <div className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
                  {String(active + 1).padStart(2, "0")}/05
                </div>
                <div className="flex gap-1.5">
                  {steps.map((_, d) => (
                    <span
                      key={d}
                      className={cn(
                        "h-2 w-2 rounded-full shadow-[inset_0_2px_4px_-2px_rgba(0, 0, 0,0.18),inset_0_1px_1px_rgba(0, 0, 0,0.18)]",
                        d === active ? "bg-orange" : "bg-soft",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden overflow-clip pb-[10px] pt-[120px] text-center max-md:block">
        <div className="flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
          <span className="h-1 w-1 rounded-full bg-orange" />
          <span>How it works</span>
          <span className="h-1 w-1 rounded-full bg-orange" />
        </div>
        <h2 className="mx-auto mt-[10px] max-w-[350px] text-[36px] font-medium leading-[43.2px] tracking-[-1.08px] text-ink">
          From plan to green
        </h2>

        <div
          aria-hidden
          className="absolute left-1/2 top-[240px] z-0 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-soft p-3 shadow-[inset_0_0_6px_0_rgba(0, 0, 0,0.18)]"
        >
          <div className="h-full w-full rounded-full border border-white bg-soft" />
        </div>
        <div aria-hidden className="absolute left-1/2 top-[336px] z-0 h-[380px] w-[520px] -translate-x-1/2 bg-cream blur-[35px]" />

        <div
          className="absolute left-1/2 top-[460px] z-10"
          style={{ transform: `rotate(${-mActive * 45}deg)`, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {steps.map((_, i) => (
            <div key={i} className="absolute h-0 w-0" style={{ transform: `rotate(${i * 45}deg) translateY(-210px)` }}>
              <div
                className={cn(
                  "absolute -left-[22px] -top-[22px] flex h-11 w-11 items-center justify-center rounded-[8px] bg-surface shadow-[0_2.5px_6px_rgba(0, 0, 0,0.1)] transition-opacity duration-500",
                  Math.abs(i - mActive) === 1 ? "opacity-100" : "opacity-0",
                )}
              >
                <span className="text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-muted-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-20 mt-6 flex flex-col items-center gap-1.5">
          <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">Step</span>
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-orange text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-accent-ink">
            {String(mActive + 1).padStart(2, "0")}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-[84px] h-[307.2px] w-[360px]">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-x-0 top-0 text-center transition-opacity duration-500",
                i === mActive ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <h3 className="text-[26px] font-medium leading-[31.2px] tracking-[-0.78px] text-ink">{step.title}</h3>
              <p className="font-desc mt-1.5 text-balance text-[15px] leading-[18px] tracking-[0.0375px] text-muted-ink">
                {step.desc}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3.5 border-y border-dashed border-hairline py-[19px] text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
                {step.tags.map((tag, t) => (
                  <span key={t} className="flex items-center gap-3.5">
                    {t > 0 && <span className="h-1 w-1 rounded-full bg-muted-ink" />}
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
              <Link
                href="#claim"
                className="mt-5 inline-block rounded-none bg-orange px-[22px] py-[10px] text-[15px] font-medium leading-[18px] tracking-[0.0375px] text-accent-ink"
                style={{ boxShadow: STEP_SHADOW }}
              >
                Claim Your Badge
              </Link>
              <div className="mt-[50px] text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
                {String(i + 1).padStart(2, "0")}/05
              </div>
              <div className="mt-2.5 flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMActive((v) => Math.max(0, v - 1))}
                  aria-label="Previous step"
                  disabled={mActive === 0}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px] bg-surface disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ink" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setMActive((v) => Math.min(steps.length - 1, v + 1))}
                  aria-label="Next step"
                  disabled={mActive === steps.length - 1}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px] bg-surface disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ink" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
