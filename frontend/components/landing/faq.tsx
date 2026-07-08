"use client";

/** @file faq.tsx - Methodology FAQ accordion with toggle items. */
import { cn } from "@/lib/utils/utils";
import { useState } from "react";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "1. What does the Loop Integrity Score measure?",
    a: "A deterministic 0–100 score built from three independent sources — the agent's log, git history, and the TestSprite run record — cross-checked line by line. Same inputs always produce the same score.",
  },
  {
    q: "2. What makes a line “verified”?",
    a: "A LOOP.md line is verified when its SHA order, run verdict, and timestamps all agree across sources. Every verified line carries a git SHA and a run ID, so anyone can re-derive it.",
  },
  {
    q: "3. What if a line can't be verified?",
    a: "It's marked unverifiable — neutral language, never a failure. It simply means a source didn't carry enough evidence to confirm or contradict the line. Methodology is one click away.",
  },
  {
    q: "4. How do you handle a blocked verdict with passing assertions?",
    a: "It's classified as a verdict mismatch (a known checker issue), never as a failure and never hidden. Passing assertions are respected even when the runner reports blocked.",
  },
  {
    q: "5. Do you ever see my private repo data?",
    a: "Only what you authorize. Authorization is enforced at the data layer, secrets never touch git, and we never render another user's private repo data.",
  },
  {
    q: "6. Can I opt out of the Season Index?",
    a: "Yes, and opt-outs are honored within minutes. The Season Index is framed as celebration, never policing — with methodology always one click away.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (i: number) => setOpen((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));

  return (
    <section id="faq" className="relative bg-cream pt-[160px] pb-[160px] md:max-lg:pb-[96px] max-md:pt-[80px] max-md:pb-[56px]">
      <div className="relative reveal">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-orange" />
            <span className="text-[12px] uppercase tracking-[0.15em] font-semibold leading-[1] text-muted-ink">METHODOLOGY</span>
            <span className="h-1 w-1 rounded-full bg-orange" />
          </div>
          <h2 className="mt-4 text-[52px] font-medium leading-[62.4px] tracking-[-1.56px] text-ink text-center md:max-lg:text-[40px] md:max-lg:leading-[48px] md:max-lg:tracking-[-1.2px] max-md:mt-[10px] max-md:text-[36px] max-md:leading-[43.2px] max-md:tracking-[-1.08px]">
            How the verifier thinks
          </h2>
        </div>

        <div className="mt-[30px] mx-auto max-w-[640px] rounded-[16px] bg-soft p-5 shadow-[inset_0_0_6px_0_rgba(0,0,0,0.55)] flex flex-col gap-5 md:max-lg:max-w-[660px] max-md:mx-5 max-md:mt-5 max-md:gap-4 max-md:p-4">
          {ITEMS.map((item, i) => {
            const isOpen = open.includes(i);
            const answerId = `faq-answer-${i}`;
            return (
              <div key={i} className="bg-surface rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left max-md:p-4"
                >
                  <span className="text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-ink max-md:text-[16px] max-md:leading-[16px] max-md:tracking-[-0.48px]">
                    {item.q}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-orange flex items-center justify-center shrink-0 relative">
                    <span className="absolute w-3 h-[1.5px] bg-accent-ink" />
                    <span className={cn("absolute w-3 h-[1.5px] bg-accent-ink transition-transform", isOpen ? "rotate-0" : "rotate-90")} />
                  </span>
                </button>
                <div
                  id={answerId}
                  aria-hidden={!isOpen}
                  className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="font-desc px-5 pb-5 text-[16px] leading-relaxed text-muted-ink">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
