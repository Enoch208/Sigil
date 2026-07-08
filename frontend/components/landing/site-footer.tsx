/** @file site-footer.tsx - Site footer: a hairline-bordered editorial container with brand, row-divided quick links, and a copyright bar. */
import Link from "next/link";

const LINK_BASE =
  "block border-b border-hairline px-0.5 py-3 text-[15px] leading-none transition last:border-b-0";

function SigilMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="Sigil" className="h-8 w-auto" />;
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 pt-[100px] pb-[40px] max-md:pt-12 max-md:pb-8">
      <div className="mx-auto max-w-[1060px] px-[30px] max-md:px-5">
        <div className="rounded-[16px] border border-strong bg-cream px-12 pt-[46px] max-md:px-[22px] max-md:pt-7">
          <div className="flex items-start justify-between gap-[60px] pb-[42px] max-md:flex-col max-md:gap-8 max-md:pb-[30px]">
            <div className="max-w-[320px] max-md:max-w-none">
              <Link href="#top" className="flex items-center gap-3">
                <SigilMark />
                <span className="text-[24px] font-bold leading-none tracking-[-0.01em] text-ink">Sigil</span>
              </Link>
              <p className="mt-[18px] max-w-[300px] font-desc text-[15px] leading-[1.5] text-muted-ink">
                The auditor for AI coding loops. It cross-checks agent logs, git, and CI so your
                green is provable — and secrets never touch git.
              </p>
            </div>

            <nav>
              <p className="mb-[14px] text-[12px] font-semibold uppercase tracking-[1.8px] text-muted-ink">QUICK LINKS</p>
              <div className="flex gap-[60px] max-md:gap-10">
                <div className="min-w-[150px] max-md:min-w-0">
                  <Link href="#product" className={`${LINK_BASE} font-semibold text-orange`}>Product</Link>
                  <Link href="#how" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>How it works</Link>
                  <Link href="#faq" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>Methodology</Link>
                  <Link href="#season" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>Season Index</Link>
                </div>
                <div className="min-w-[150px] max-md:min-w-0">
                  <Link href="#claim" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>GitHub</Link>
                  <Link href="#claim" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>TestSprite</Link>
                  <Link href="#claim" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>Neon</Link>
                  <Link href="#claim" className={`${LINK_BASE} font-medium text-ink hover:text-orange`}>Vercel</Link>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center justify-between gap-[18px] border-t border-hairline px-0.5 py-[22px] font-desc text-[13px] text-muted-ink max-md:flex-col max-md:items-start max-md:gap-2">
            <span>&copy; 2026 Sigil · Loopscope</span>
            <span>Zero secrets in git · Methodology published</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
