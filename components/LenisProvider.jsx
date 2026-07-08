"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Smooth scroll for the whole site. Lenis drives native window scroll, so
// scroll events / position reads elsewhere keep working. The instance is
// shared on window for anchor navigation (nav links).
export default function LenisProvider({ children }) {
  useEffect(() => {
    // Always land at the top on refresh unless the URL targets a section —
    // the browser's scroll restoration would otherwise drop you mid-page.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
    });
    window.__lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
