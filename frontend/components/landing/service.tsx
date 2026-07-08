/** @file service.tsx - Section intro + 3 product cards (verify / replay / share). */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge02Icon,
  PlayCircleIcon,
  FingerPrintIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type Service = { title: string; icon: IconSvgElement; desc: React.ReactNode };

const SERVICES: Service[] = [
  {
    title: "Line-by-Line Verification",
    icon: CheckmarkBadge02Icon,
    desc: "Every LOOP.md line is checked against its git SHA and TestSprite run verdict, then resolves to verified, unverifiable, or contradicted. The methodology is public.",
  },
  {
    title: "Live Replay",
    icon: PlayCircleIcon,
    desc: "Scrub the whole loop end to end — time-to-green, banked-suite growth, and per-fix diffs — streamed live over SSE as each run lands.",
  },
  {
    title: "Badge & Season Index",
    icon: FingerPrintIcon,
    desc: (
      <>
        Ship a README badge and a public proof page, then see how loops break across the season with
        failure fingerprints. Celebration, never policing.
      </>
    ),
  },
];

function ServiceCard({ title, icon, desc }: Service) {
  return (
    <div className="rounded-[8px] bg-surface p-5 shadow-card max-md:p-4 lg:flex lg:flex-1 lg:min-w-0 lg:flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-dashed border-hairline pb-[19px] max-md:pb-4">
        <h3 className="text-[22px] font-medium leading-[26.4px] tracking-[-0.66px] text-ink max-md:text-[20px] max-md:leading-[24px] max-md:tracking-[-0.6px]">
          {title}
        </h3>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-hairline bg-elevated text-orange max-md:h-[30px] max-md:w-[30px] max-md:rounded-[4px]">
          <HugeiconsIcon icon={icon} size={22} strokeWidth={1.6} />
        </div>
      </div>

      <p className="font-desc mt-5 text-balance text-[16px] leading-[19.2px] tracking-[0.04px] text-muted-ink max-md:mt-4 max-md:text-[15px] max-md:leading-[18px] max-md:tracking-[0.0375px]">
        {desc}
      </p>
    </div>
  );
}

export function Service() {
  return (
    <section id="service" className="relative bg-cream pt-[160px] pb-0 max-md:pt-[80px]">
      <div className="mx-auto grid max-w-[1000px] lg:max-w-[1120px] gap-[30px] reveal md:max-lg:max-w-[720px] md:max-lg:px-0 max-md:gap-6 max-md:px-5">
        <div className="h-fit">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1 w-1 rounded-full bg-orange" />
            <span className="text-[12px] font-semibold uppercase leading-[12px] tracking-[1.8px] text-muted-ink">
              PRODUCT
            </span>
            <span className="h-1 w-1 rounded-full bg-orange" />
          </div>

          <h2 className="mt-4 mx-auto max-w-[520px] lg:max-w-none text-center text-[52px] font-medium leading-[62.4px] tracking-[-1.56px] text-ink md:max-lg:text-[40px] md:max-lg:leading-[48px] md:max-lg:tracking-[-1.2px] max-md:mt-[10px] max-md:text-[32px] max-md:leading-[38.4px] max-md:tracking-[-0.96px]">
            Verify, replay, <br className="lg:hidden" />
            and prove every loop
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 rounded-[16px] bg-soft p-5 shadow-[inset_0_0_6px_0_rgba(0,0,0,0.55)] max-md:gap-3 max-md:p-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
