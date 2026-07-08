"use client";

/**
 * @file reveal-observer.tsx @description Adds `.appeared` to each `.reveal` child as it scrolls into view.
 */
import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal > *"));
    if (!items.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("appeared"));
      return;
    }

    const pending: HTMLElement[] = [];
    for (const el of items) {
      if (el.getBoundingClientRect().bottom <= 0) el.classList.add("appeared");
      else pending.push(el);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (!el.parentElement?.classList.contains("reveal-load")) {
              el.style.transitionDelay = `${k * 50}ms`;
              k++;
            }
            el.classList.add("appeared");
            obs.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    pending.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
