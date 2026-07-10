import Link from "next/link";
import { redirect } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, ArrowRight01Icon, ShieldKeyIcon } from "@hugeicons/core-free-icons";
import { getSession } from "@/lib/auth/session";

const ERRORS: Record<string, string> = {
  config: "GitHub sign-in isn't configured on this deployment yet — continue with the demo.",
  denied: "Authorization was cancelled.",
  state: "That sign-in link expired. Please try again.",
  token: "Couldn't complete GitHub sign-in. Please try again.",
  user: "Couldn't read your GitHub profile. Please try again.",
  network: "Network error reaching GitHub. Please try again.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect("/season");
  const { error } = await searchParams;
  const message = error ? (ERRORS[error] ?? "Something went wrong. Please try again.") : null;

  return (
    <div className="grid min-h-screen place-items-center bg-[#090A0C] px-5 text-[#F4F5F7] antialiased">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-[22px] w-auto" />
          <span className="font-display text-[19px] font-semibold tracking-tight">Sigil</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/[0.05] bg-gradient-to-b from-[#15171F] to-[#0F1116] p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <h1 className="text-center font-display text-[20px] font-semibold tracking-tight">Sign in to Sigil</h1>
          <p className="mt-2 text-center font-desc text-[13px] leading-relaxed text-zinc-400">
            Connect GitHub to audit your own loops. Browsing the Season Index needs no account.
          </p>

          {message ? (
            <div className="mt-5 rounded-xl border border-[#DB9090]/25 bg-[#DB9090]/10 px-3.5 py-2.5 font-desc text-[12px] leading-relaxed text-[#DB9090]">
              {message}
            </div>
          ) : null}

          <a
            href="/api/auth/github"
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 font-desc text-[13.5px] font-medium text-[#F4F5F7] transition-colors hover:bg-white/[0.1]"
          >
            <HugeiconsIcon icon={Github01Icon} size={18} strokeWidth={1.8} />
            Continue with GitHub
          </a>

          <Link
            href="/season"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-desc text-[12.5px] text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Just exploring? View the live demo
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
          </Link>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 font-desc text-[11.5px] text-zinc-600">
          <HugeiconsIcon icon={ShieldKeyIcon} size={13} />
          Read-only profile access. Secrets never touch git.
        </p>
      </div>
    </div>
  );
}
