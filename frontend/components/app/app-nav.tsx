export function AppNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3.5">
        <a href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-[18px] w-auto" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-fg-primary">Sigil</span>
        </a>
        <nav className="flex items-center gap-6 font-desc text-[13px] text-fg-muted">
          <a href="/season" className="transition-colors hover:text-fg-primary">Season Index</a>
          <a href="/api/methodology" className="transition-colors hover:text-fg-primary">Methodology</a>
          <a
            href="https://github.com/Enoch208/Sigil"
            className="rounded-pill border border-hairline px-3 py-1.5 transition-colors hover:border-strong hover:text-fg-primary"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
