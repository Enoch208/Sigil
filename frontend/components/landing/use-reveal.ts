"use client";

/** @file use-reveal.ts - IntersectionObserver hook that flips an element to its revealed state once it scrolls into view. */
import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean },
) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } = options ?? {};
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const reveal = (value: boolean) => {
      frame = requestAnimationFrame(() => setInView(value));
    };
    if (typeof IntersectionObserver === "undefined") {
      reveal(true);
      return () => cancelAnimationFrame(frame);
    }
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= 0) {
      reveal(true);
      if (once) return () => cancelAnimationFrame(frame);
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      obs.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
