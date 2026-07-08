/** @file footer-deco.tsx - Concentric ring tracks behind the CTA banner and footer with orbiting icon cards. */
import type { CSSProperties } from "react";
import {
  GitBranchIcon,
  CheckmarkBadge02Icon,
  Activity01Icon,
  FingerPrintIcon,
  SecurityCheckIcon,
  PlayCircleIcon,
  Tick02Icon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { Orbit } from "./orbit";

const FOOTER_ORBIT_ICONS = [
  GitBranchIcon,
  CheckmarkBadge02Icon,
  Activity01Icon,
  FingerPrintIcon,
  SecurityCheckIcon,
  PlayCircleIcon,
  Tick02Icon,
  ShieldKeyIcon,
];

export function FooterDeco() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 max-md:hidden">
      <div className="absolute left-1/2 top-[1300px] h-[2400px] w-[2400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-soft shadow-[inset_0_0_8px_0_rgba(0,0,0,0.6)]">
        <div className="absolute inset-[10px] rounded-full border border-white/10 bg-cream" />
      </div>
      <div className="absolute left-1/2 top-[1300px] h-[2200px] w-[2200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-soft shadow-[inset_0_0_8px_0_rgba(0,0,0,0.6)]">
        <div className="absolute inset-[12px] rounded-full border border-white/10 bg-cream" />
      </div>
      <Orbit
        side="left"
        icons={FOOTER_ORBIT_ICONS}
        count={16}
        style={
          {
            "--orbit-cx": "50%",
            "--orbit-cy": "1300px",
            "--orbit-r": "1195px",
            "--orbit-step": "22.5deg",
            "--orbit-card": "76px",
            "--orbit-dur": "150s",
          } as CSSProperties
        }
      />
    </div>
  );
}
