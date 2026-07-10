"use client";

/** @file site-nav.tsx - Fixed pill navbar with hamburger dropdown menu (landing page). */
import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils/utils";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
  { label: "Methodology", href: "#faq" },
  { label: "Season Index", href: "#season" },
] as const;

function SigilMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="Sigil" className="h-[26px] w-auto" />;
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] transition-opacity duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[30px] pointer-events-none max-md:px-5 max-md:pt-5">
        <div className="relative pointer-events-auto max-md:w-full">
          <nav
            className={cn(
              "flex h-14 items-center border border-hairline bg-surface shadow-card max-md:w-full",
              open ? "rounded-t-[8px]" : "rounded-[8px]",
            )}
          >
            <Link
              href="#top"
              className={cn(
                "flex items-center py-3 transition-[width,padding] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] max-md:!w-auto max-md:!flex-1 max-md:!px-3",
                open ? "w-[189px] pl-6 pr-3" : "w-[165px] px-3",
              )}
            >
              <span className="flex items-center gap-2">
                <SigilMark />
                <span className="text-[22px] font-bold leading-none tracking-[-0.01em] text-ink">Sigil</span>
              </span>
            </Link>
            <div className="flex w-[70px] items-center justify-center border-l border-hairline py-1.5 max-md:w-[54px]">
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="relative flex h-11 w-11 flex-col items-center justify-center gap-[6px]"
              >
                <span
                  className={cn(
                    "h-px w-5 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
                    open && "translate-y-[3.5px] rotate-[30deg]",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-5 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
                    open && "-translate-y-[3.5px] -rotate-[30deg]",
                  )}
                />
              </button>
            </div>
            <div
              className={cn(
                "flex items-center justify-end gap-1.5 border-l border-hairline py-3 transition-[width,padding] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] max-md:hidden",
                open ? "w-[205px] pl-3 pr-6" : "w-[181px] px-3",
              )}
            >
              <a
                href="https://github.com/Enoch208/Sigil"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="grid h-8 w-8 place-items-center text-ink transition hover:text-orange"
              >
                <HugeiconsIcon icon={Github01Icon} size={19} strokeWidth={1.8} />
              </a>
              <Link
                href="/signin"
                className="rounded-none bg-orange px-3.5 py-1.5 text-[14px] font-medium leading-[16.8px] text-accent-ink shadow-[0_0_0_1px_#b9791a,inset_0_1.4px_1px_rgba(255,255,255,0.28)] transition hover:brightness-105"
              >
                Sign in
              </Link>
            </div>
          </nav>

          <div
            className={cn(
              "absolute left-0 right-0 top-full origin-top overflow-hidden rounded-b-[8px] border border-t-0 border-hairline bg-surface px-6 py-2 shadow-dialog transition-opacity duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
              open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            )}
            aria-hidden={!open}
          >
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                style={{ transitionDelay: open ? `${40 + i * 50}ms` : "300ms" }}
                className={cn(
                  "block border-b border-dashed border-hairline py-4 text-[24px] leading-[24px] font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:text-orange",
                  open ? "translate-x-0" : "-translate-x-4",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div
              style={{ transitionDelay: open ? `${40 + NAV_LINKS.length * 50}ms` : "300ms" }}
              className={cn(
                "flex flex-col gap-2 py-4 transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
                open ? "translate-x-0" : "-translate-x-4",
              )}
            >
              <Link
                href="/season"
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center justify-center rounded-none bg-orange px-4 py-2.5 text-[15px] font-medium text-accent-ink shadow-[0_0_0_1px_#b9791a,inset_0_1.4px_1px_rgba(255,255,255,0.28)]"
              >
                View live demo
              </Link>
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex items-center justify-center gap-2 rounded-none border border-strong px-4 py-2.5 text-[15px] font-medium text-ink"
              >
                <HugeiconsIcon icon={Github01Icon} size={17} strokeWidth={1.8} /> Sign in
              </Link>
            </div>

            <div
              style={{ transitionDelay: open ? `${40 + (NAV_LINKS.length + 1) * 50}ms` : "300ms" }}
              className={cn(
                "flex items-center py-4 transition-transform duration-300 ease-[cubic-bezier(0.44,0,0.56,1)]",
                open ? "translate-x-0" : "-translate-x-4",
              )}
            >
              <p className="text-[12px] text-muted-ink">&copy; 2026 Sigil</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
