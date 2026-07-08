"use client";

/** @file orbit.tsx - Ring of hugeicon cards orbiting an off-screen center. Driven by CSS vars set per breakpoint via className. */
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils/utils";

type OrbitProps = {
  side: "left" | "right";
  icons: IconSvgElement[];
  count?: number;
  iconSize?: number;
  offset?: number;
  className?: string;
  style?: CSSProperties;
};

export function Orbit({ side, icons, count = 12, iconSize = 30, offset = 0, className, style }: OrbitProps) {
  const cards = Array.from({ length: count }, (_, i) => icons[(i + offset) % icons.length]);

  return (
    <div
      className={cn("orbit-field", side === "left" ? "orbit-field-left" : "orbit-field-right", className)}
      style={style}
    >
      <div className="orbit-spin">
        {cards.map((icon, i) => (
          <div key={i} className="orbit-item" style={{ "--i": i } as CSSProperties}>
            <div className="orbit-card">
              <HugeiconsIcon icon={icon} size={iconSize} strokeWidth={1.6} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
