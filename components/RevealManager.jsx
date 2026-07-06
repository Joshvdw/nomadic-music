"use client";

import { useEffect } from "react";

// One IntersectionObserver for every [data-reveal] element on the page.
// Adds .is-inview the first time an element enters the viewport; CSS does
// the rest (variants + stagger). A MutationObserver picks up late arrivals.
export default function RevealManager() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );

    const observeAll = (root) =>
      root.querySelectorAll("[data-reveal]").forEach((el) => {
        if (!el.classList.contains("is-inview")) io.observe(el);
      });

    observeAll(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.("[data-reveal]")) io.observe(node);
          observeAll(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
