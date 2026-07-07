"use client";

import { useEffect } from "react";

// One IntersectionObserver pair for every [data-reveal] element on the page.
// Adds .is-inview the first time an element enters the viewport; CSS does
// the rest (variants + stagger). A MutationObserver picks up late arrivals.
//
// Elements additionally marked [data-reveal-late] wait until their top edge
// crosses the middle of the viewport (used by full-bleed imagery).
export default function RevealManager() {
  useEffect(() => {
    const onEnter = (io) => (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      }
    };

    // phones reveal sooner — less viewport to work with
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const io = new IntersectionObserver(
      (entries) => onEnter(io)(entries),
      {
        threshold: mobile ? 0.12 : 0.2,
        rootMargin: mobile ? "0px 0px -6% 0px" : "0px 0px -18% 0px",
      }
    );
    const ioLate = new IntersectionObserver(
      (entries) => onEnter(ioLate)(entries),
      { threshold: 0, rootMargin: mobile ? "0px 0px -28% 0px" : "0px 0px -50% 0px" }
    );

    const observe = (el) => {
      if (el.classList.contains("is-inview")) return;
      (el.hasAttribute("data-reveal-late") ? ioLate : io).observe(el);
    };

    const observeAll = (root) =>
      root.querySelectorAll("[data-reveal]").forEach(observe);

    observeAll(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.("[data-reveal]")) observe(node);
          observeAll(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      ioLate.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
