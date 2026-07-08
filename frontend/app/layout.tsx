import type { Metadata } from "next";
import { Outfit, Lexend } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sigil — The trust layer for AI coding loops",
  description:
    "Sigil cross-checks your agent's log, git history, and CI runs — line by line — into one deterministic Loop Integrity Score. The log proves itself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${lexend.variable}`}>
      <body>{children}</body>
    </html>
  );
}
