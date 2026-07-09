import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  GridIcon,
  FingerPrintIcon,
  FileValidationIcon,
  Shield01Icon,
  Github01Icon,
} from "@hugeicons/core-free-icons";

function NavItem({ icon, label, href, active }: { icon: IconSvgElement; label: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 font-desc text-[13.5px] transition-colors ${
        active ? "bg-elevated text-fg-primary" : "text-fg-muted hover:bg-surface hover:text-fg-primary"
      }`}
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.7} className={active ? "text-accent" : ""} />
      {label}
    </Link>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[236px] shrink-0 flex-col border-r border-hairline bg-page px-4 py-5 max-lap:hidden">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" className="h-[18px] w-auto" />
        <span className="font-display text-[16px] font-semibold tracking-tight text-fg-primary">Sigil</span>
      </Link>

      <nav className="mt-9 flex flex-col gap-0.5">
        <div className="px-3 pb-1.5 font-desc text-[10.5px] uppercase tracking-[0.16em] text-fg-hint">Audit</div>
        <NavItem icon={DashboardSquare01Icon} label="Overview" href="/season" active />
        <NavItem icon={GridIcon} label="Projects" href="/season#leaderboard" />
        <NavItem icon={FingerPrintIcon} label="Fingerprints" href="/season#fingerprints" />
        <NavItem icon={FileValidationIcon} label="Methodology" href="/api/methodology" />
      </nav>

      <div className="mt-auto flex flex-col gap-2.5">
        <div className="rounded-lg border border-hairline bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Shield01Icon} size={16} className="text-positive" />
            <span className="font-desc text-[12px] font-medium text-fg-primary">Self-proving loop</span>
          </div>
          <p className="mt-1.5 font-desc text-[11.5px] leading-relaxed text-fg-muted">
            Our own <span className="font-mono">LOOP.md</span> scores 100 — CI-gated, run-verified 6/6.
          </p>
          <Link href="/l/loopscope/sigil" className="mt-2.5 inline-block font-desc text-[12px] font-medium text-accent transition-opacity hover:opacity-80">
            View loop →
          </Link>
        </div>
        <a
          href="https://github.com/Enoch208/Sigil"
          className="flex items-center gap-3 rounded-md px-3 py-2 font-desc text-[13px] text-fg-muted transition-colors hover:text-fg-primary"
        >
          <HugeiconsIcon icon={Github01Icon} size={18} strokeWidth={1.7} /> GitHub
        </a>
      </div>
    </aside>
  );
}
