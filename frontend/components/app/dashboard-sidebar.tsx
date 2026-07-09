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
      className={`flex items-center gap-3 rounded-xl px-3 py-2 font-desc text-[13px] transition-colors ${
        active ? "bg-white/[0.07] text-[#F4F5F7]" : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
      }`}
    >
      <HugeiconsIcon icon={icon} size={17} strokeWidth={1.7} className={active ? "text-[#F4F5F7]" : ""} />
      {label}
    </Link>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[236px] shrink-0 flex-col border-r border-white/[0.06] bg-[#090A0C] px-4 py-6 max-lap:hidden">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" className="h-[17px] w-auto" />
        <span className="font-display text-[15px] font-semibold tracking-tight text-[#F4F5F7]">Sigil</span>
      </Link>

      <nav className="mt-10 flex flex-col gap-0.5">
        <div className="px-3 pb-2 font-desc text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Audit</div>
        <NavItem icon={DashboardSquare01Icon} label="Overview" href="/season" active />
        <NavItem icon={GridIcon} label="Projects" href="/season#leaderboard" />
        <NavItem icon={FingerPrintIcon} label="Fingerprints" href="/season#fingerprints" />
        <NavItem icon={FileValidationIcon} label="Methodology" href="/api/methodology" />
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="rounded-2xl border border-white/[0.05] bg-gradient-to-b from-[#15171F] to-[#0F1116] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Shield01Icon} size={15} className="text-[#5CC79E]" />
            <span className="font-desc text-[12px] font-medium text-[#F4F5F7]">Self-proving loop</span>
          </div>
          <p className="mt-2 font-desc text-[11.5px] leading-relaxed text-zinc-400">
            Our own <span className="font-mono">LOOP.md</span> scores 100 — CI-gated, run-verified 6/6.
          </p>
          <Link href="/l/loopscope/sigil" className="mt-3 inline-block font-desc text-[12px] font-medium text-zinc-300 transition-colors hover:text-zinc-100">
            View loop →
          </Link>
        </div>
        <a
          href="https://github.com/Enoch208/Sigil"
          className="flex items-center gap-3 rounded-xl px-3 py-2 font-desc text-[12.5px] text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <HugeiconsIcon icon={Github01Icon} size={17} strokeWidth={1.7} /> GitHub
        </a>
      </div>
    </aside>
  );
}
