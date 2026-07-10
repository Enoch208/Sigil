"use client";

/** @file hero.tsx - Hero with headline, CTAs and concentric ring decor with orbiting icon cards. */
import type { CSSProperties } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Github01Icon,
  GitBranchIcon,
  CheckmarkBadge02Icon,
  Activity01Icon,
  GitCommitIcon,
  FingerPrintIcon,
  SecurityCheckIcon,
  PlayCircleIcon,
  SourceCodeIcon,
  Tick02Icon,
  ShieldKeyIcon,
  Timer01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils/utils";
import { useReveal } from "./use-reveal";
import { Orbit } from "./orbit";

const HERO_ICONS = [
  GitBranchIcon,
  CheckmarkBadge02Icon,
  Activity01Icon,
  GitCommitIcon,
  FingerPrintIcon,
  SecurityCheckIcon,
  PlayCircleIcon,
  SourceCodeIcon,
  Tick02Icon,
  ShieldKeyIcon,
  Timer01Icon,
  FlashIcon,
];

const PRIMARY_SHADOW = "0 0 0 1px #b9791a, inset 0 1.4px 1px rgba(255,255,255,.28), 0 8px 22px -8px rgba(245,165,36,.5)";
const SECONDARY_SHADOW = "inset 0 1.4px 1px rgba(255,255,255,.08), 0 0 0 1.4px rgba(255,255,255,.16)";

const RINGS = [
  { size: 1800, anchor: 2360, pad: 10, delay: 250, tabletHidden: false },
  { size: 1400, anchor: 2110, pad: 8, delay: 125, tabletHidden: false },
  { size: 1000, anchor: 1860, pad: 6, delay: 50, tabletHidden: true },
];

function HeroRings({ side }: { side: "left" | "right" }) {
  return (
    <>
      {RINGS.map((r) => (
        <div
          key={r.size}
          className={cn("hero-ring", r.tabletHidden && "max-lg:hidden")}
          style={
            {
              width: r.size,
              height: r.size,
              top: "50%",
              [side]: `calc(50% - ${r.anchor}px)`,
              "--ring-pad": `${r.pad}px`,
              "--ring-slide": side === "left" ? "-50px" : "50px",
              transitionDelay: `${side === "right" ? r.delay + (r.size === 1400 ? 100 : r.size === 1000 ? 125 : 0) : r.delay}ms`,
            } as CSSProperties
          }
        >
          <div className="hero-ring-bg" />
        </div>
      ))}
    </>
  );
}

export function Hero() {
  const { ref, inView } = useReveal<HTMLElement>({ threshold: 0 });

  return (
    <section
      ref={ref}
      className="glow-amber relative flex min-h-[min(100svh,900px)] flex-col items-center justify-center overflow-hidden bg-cream py-[clamp(6rem,14vh,9rem)] text-center"
    >
      <div aria-hidden className={cn("hero-deco absolute inset-0 z-0 max-md:hidden", inView && "is-in")}>
        <HeroRings side="left" />
        <HeroRings side="right" />
        <Orbit
          side="left"
          icons={HERO_ICONS}
          iconSize={30}
          className="hero-orbit-field"
          style={{ transitionDelay: "250ms" } as CSSProperties}
        />
        <Orbit
          side="right"
          icons={HERO_ICONS}
          iconSize={30}
          offset={3}
          className="hero-orbit-field"
          style={{ "--ring-slide": "50px", transitionDelay: "250ms" } as CSSProperties}
        />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center reveal reveal-load px-[clamp(1.25rem,5vw,2rem)]",
          inView && "is-in",
        )}
      >
        <span className="inline-flex items-center gap-2 rounded-[4px] bg-soft-2 px-2.5 py-1.5 shadow-[inset_0_0_5px_0_rgba(0,0,0,0.4)]">
          <span className="h-1 w-1 rounded-full bg-orange" />
          <span className="text-[clamp(0.6875rem,0.66rem+0.1vw,0.75rem)] font-semibold uppercase leading-[1] tracking-[0.12em] text-muted-ink">
            Deterministic loop verification
          </span>
          <span className="h-1 w-1 rounded-full bg-orange" />
        </span>

        <h1 className="mt-[clamp(1rem,2vw,1.5rem)] text-balance font-medium text-ink text-[clamp(2.5rem,1.83rem+3.33vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
          <span className="block">The trust layer for</span>
          <span className="block text-orange">AI coding loops.</span>
        </h1>

        <p className="font-desc mt-[clamp(0.75rem,1.5vw,1.25rem)] max-w-[58ch] text-pretty text-muted-ink text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-[1.6]">
          Sigil cross-checks your agent&apos;s log, git history, and CI runs — line by line — into
          one deterministic Loop Integrity Score. The log proves itself.
        </p>

        <div className="mt-[clamp(1.5rem,3vw,2rem)] flex w-full flex-row flex-wrap items-center justify-center gap-3 min-[480px]:w-auto min-[480px]:gap-4">
          <Link
            href="/season"
            className="inline-flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-none bg-orange px-[18px] text-[16px] font-medium text-accent-ink transition hover:brightness-105"
            style={{ boxShadow: PRIMARY_SHADOW }}
          >
            <HugeiconsIcon icon={PlayCircleIcon} size={18} strokeWidth={2} />
            View live demo
          </Link>
          <a
            href="https://github.com/Enoch208/Sigil"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-none bg-elevated px-[18px] text-[16px] font-medium text-white transition hover:brightness-110"
            style={{ boxShadow: SECONDARY_SHADOW }}
          >
            <HugeiconsIcon icon={Github01Icon} size={18} strokeWidth={1.8} />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
