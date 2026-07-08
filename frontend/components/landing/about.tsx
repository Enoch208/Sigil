"use client";

/** @file about.tsx - "Under the hood" bento grid: what the Loop Integrity Score is made of. */
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, SecurityCheckIcon, GitCommitIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils/utils";

const STACK = ["GitHub", "TestSprite", "Neon", "Vercel", "Next.js", "Postgres", "SSE", "LOOP.md"];
const SOURCES = ["agent log", "git history", "CI run"];
const TILES = [
  { sha: "a1f3c9e", left: 31.5, top: 0, size: 118, rotate: -16 },
  { sha: "7b2d004", left: 128.4, top: 8.2, size: 108, rotate: -7 },
  { sha: "c4e9a17", left: 216.4, top: 7.5, size: 108, rotate: -7 },
  { sha: "e0b7f52", left: 292.1, top: 7.9, size: 116, rotate: 13 },
];

const CTA_SHADOW = "0 0 0 1px #b9791a, inset 0 1.4px 1px rgba(255,255,255,0.28)";

function CardVerified() {
  return (
    <article className="col-span-1 flex min-h-[290px] flex-col justify-between rounded-lg bg-surface p-5 text-center shadow-card max-md:col-span-1 max-md:min-h-0 max-md:h-[188px] max-md:px-4 md:col-span-1">
      <div>
        <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">Provable green</h3>
        <p className="font-desc mt-[6px] text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:text-[15px]">
          Every LOOP.md line is checked, not trusted.
        </p>
      </div>
      <div>
        <p className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-orange">VERIFIED</p>
        <div className="mt-[14px] flex items-center justify-center gap-[10px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={cn(
                "flex h-[26px] w-[26px] items-center justify-center rounded-full max-md:h-[30px] max-md:w-[30px]",
                n === 5 ? "bg-orange text-accent-ink" : "bg-orange/10 text-orange",
              )}
            >
              <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.6} />
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CardSources() {
  return (
    <article className="relative col-span-3 flex gap-5 min-h-[290px] rounded-lg bg-surface p-5 shadow-card ring-1 ring-hairline max-md:col-span-1 max-md:min-h-0 max-md:flex-col max-md:gap-4 max-md:px-4 md:max-lg:col-span-1 md:max-lg:flex-col md:max-lg:gap-4">
      <div className="flex flex-1 flex-col justify-center gap-3 rounded-lg bg-soft p-4 shadow-inset">
        {SOURCES.map((src) => (
          <div key={src} className="flex items-center justify-between rounded-[10px] bg-surface px-3.5 py-3 shadow-card">
            <span className="rounded-md bg-elevated px-2.5 py-1.5 font-mono text-[12px] leading-none tracking-tight text-ink">
              {src}
            </span>
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1">
                <span className="h-[3px] w-[3px] rounded-full bg-muted-ink" />
                <span className="h-[3px] w-[3px] rounded-full bg-muted-ink" />
                <span className="h-[3px] w-[3px] rounded-full bg-muted-ink" />
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange text-accent-ink">
                <HugeiconsIcon icon={Tick02Icon} size={10} strokeWidth={3} />
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-lg bg-soft p-5 shadow-inset max-md:p-4 max-md:gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-orange shadow-card">
          <HugeiconsIcon icon={SecurityCheckIcon} size={20} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">
            Cross-checked, not trusted
          </h3>
          <p className="font-desc mt-[10px] text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:text-[15px]">
            The agent&apos;s log, the git history, and the CI run are reconciled against each other —
            line by line — so no single source gets the last word.
          </p>
        </div>
      </div>
    </article>
  );
}

function CardClaim() {
  return (
    <article className="relative col-span-2 flex h-[303.6px] flex-col items-center overflow-hidden rounded-lg bg-elevated px-5 pb-0 pt-5 text-center max-md:col-span-1 max-md:h-auto max-md:px-4 max-md:pb-6 md:col-span-2 md:max-lg:col-span-1">
      <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_-5%,rgba(245,165,36,0.20),transparent_60%)]" />
      <div className="relative z-[1] flex w-full flex-col items-center">
        <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">Claim your badge</h3>
        <Link
          href="#claim"
          className="mt-[46px] inline-block rounded-none bg-orange px-[22px] py-[10px] text-[16px] font-medium leading-[19.2px] tracking-[0.04px] text-accent-ink max-md:mt-4 max-md:text-[15px]"
          style={{ boxShadow: CTA_SHADOW }}
        >
          Claim Your Badge
        </Link>
        <p className="font-desc mt-[10px] text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:mt-[6px] max-md:text-[15px]">
          A README badge and a public proof page.
        </p>
        <div className="relative mt-[34px] h-[118px] w-[430px] shrink-0 origin-top md:hidden lg:block max-md:mt-7 max-md:h-[82px] max-md:scale-[0.6]">
          {TILES.map((t) => (
            <div
              key={t.sha}
              className="absolute flex items-center justify-center overflow-hidden rounded-lg border border-hairline bg-surface shadow-card"
              style={{ left: t.left, top: t.top, width: t.size, height: t.size, transform: `rotate(${t.rotate}deg)` }}
            >
              <span className="flex flex-col items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-positive-bg text-positive">
                  <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.6} />
                </span>
                <span className="font-mono text-[11px] text-muted-ink">{t.sha}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function Ring({
  sizeClass,
  wrapClass,
  value,
  label,
  valueClass,
}: {
  sizeClass: string;
  wrapClass?: string;
  value: string;
  label: string;
  valueClass: string;
}) {
  return (
    <div className={cn("text-center", wrapClass)}>
      <div className={cn("mx-auto flex items-center justify-center rounded-full border-[3px] border-orange bg-orange/15 max-md:border-2", sizeClass)}>
        <span className={cn("font-medium text-ink", valueClass)}>{value}</span>
      </div>
      <p className="mt-2.5 text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink max-md:mt-2">{label}</p>
    </div>
  );
}

function CardMetrics() {
  return (
    <article className="col-span-2 flex h-[303.6px] flex-col rounded-lg bg-surface p-5 shadow-card max-md:col-span-1 max-md:h-[278px] max-md:px-4 md:col-span-2 md:max-lg:col-span-1 max-md:text-center">
      <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">Reproducible by design</h3>
      <p className="font-desc mt-[6px] text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:text-[15px]">
        Same inputs, same score — every single time.
      </p>
      <div className="mt-auto flex items-end justify-center gap-[60px] pt-6 max-md:flex-wrap max-md:items-start max-md:gap-x-[73px] max-md:gap-y-4 max-md:pt-4">
        <Ring sizeClass="h-[76px] w-[76px] max-md:h-10 max-md:w-10" wrapClass="max-md:order-1" value="3" label="SOURCES" valueClass="text-[18px] max-md:text-[13px]" />
        <Ring sizeClass="h-[110px] w-[110px] max-md:h-[60px] max-md:w-[60px]" wrapClass="max-md:order-3 max-md:w-full" value="98" label="INTEGRITY" valueClass="text-[24px] max-md:text-[15px]" />
        <Ring sizeClass="h-[76px] w-[76px] max-md:h-10 max-md:w-10" wrapClass="max-md:order-2" value="0" label="CONTRADICTED" valueClass="text-[18px] max-md:text-[13px]" />
      </div>
    </article>
  );
}

function CardRail() {
  return (
    <Link
      href="#how"
      className="col-span-1 flex min-h-[266px] flex-col rounded-lg bg-surface p-5 shadow-card max-md:order-last max-md:col-span-1 max-md:min-h-0 max-md:h-auto max-md:px-4 md:col-span-1"
    >
      <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">Line-by-line</h3>
      <p className="font-desc mt-2 text-[14px] leading-[16.8px] tracking-[0.035px] text-muted-ink max-md:text-[13px]">one verdict per line, with its SHA</p>
      <div className="flex-1" />
      <div className="overflow-hidden rounded-lg border border-hairline bg-elevated max-md:mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/verify-rail.svg" className="h-[100px] w-full object-contain p-3 max-md:h-auto max-md:aspect-[2/1]" alt="" />
      </div>
    </Link>
  );
}

function CardStack() {
  return (
    <article className="col-span-2 flex min-h-[266px] flex-col overflow-hidden rounded-lg bg-surface p-5 shadow-card max-md:col-span-1 max-md:min-h-0 max-md:h-[382px] max-md:px-4 md:col-span-2">
      <h3 className="text-center text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px]">Built on</h3>
      <div className="relative mt-5 h-[180px] overflow-hidden max-md:h-[298px]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,#15151d_15%,rgba(21,21,29,0)_32.5%,rgba(21,21,29,0)_67.4%,#15151d_85%)]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,#15151d_20%,rgba(21,21,29,0)_59%,#15151d_80%)]" />
        <div className="flex animate-marquee-up flex-col items-center gap-3" style={{ ["--marquee-duration"]: "29.6s" } as React.CSSProperties}>
          {[...STACK, ...STACK].map((item, i) => (
            <span key={`${item}-${i}`} className="flex w-full flex-col items-center gap-3">
              <span className="flex items-center gap-3.5">
                <span className="h-1 w-1 rounded-full bg-orange" />
                <span className="whitespace-nowrap text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-orange max-md:text-[10px]">{item}</span>
                <span className="h-1 w-1 rounded-full bg-orange" />
              </span>
              <span className="w-full border-t border-dashed border-hairline" />
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CardLive() {
  return (
    <article className="relative col-span-1 flex min-h-[266px] flex-col justify-between overflow-hidden rounded-lg bg-elevated p-5 max-md:col-span-1 max-md:min-h-0 max-md:h-[200px] md:col-span-1">
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(245,165,36,0.14),transparent_65%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative z-[1] flex items-center gap-2">
        <span className="relative inline-flex h-2 w-2">
          <span className="status-ping absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-positive" />
          <span className="relative h-2 w-2 rounded-full bg-positive" />
        </span>
        <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-ink">LIVE ON GITHUB</span>
      </div>
      <div className="relative z-[1]">
        <p className="font-mono text-[28px] font-semibold leading-none tracking-tight text-ink">
          98<span className="text-[16px] text-muted-ink">/100</span>
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
          <HugeiconsIcon icon={GitCommitIcon} size={13} strokeWidth={1.8} />
          Loop Integrity
        </p>
      </div>
    </article>
  );
}

export function About() {
  return (
    <section className="relative bg-cream pt-[160px] pb-0 max-md:pt-[80px]">
      <div className="mx-auto max-w-[1060px] px-[30px] max-md:px-5">
        <div className="grid grid-cols-4 gap-5 rounded-[16px] bg-soft p-5 shadow-inset reveal max-md:grid-cols-1 max-md:gap-4 max-md:p-4 md:max-lg:grid-cols-2 md:max-lg:[grid-auto-flow:dense]">
          <CardVerified />
          <CardSources />
          <CardClaim />
          <CardMetrics />
          <CardRail />
          <CardStack />
          <CardLive />
        </div>
      </div>
    </section>
  );
}
