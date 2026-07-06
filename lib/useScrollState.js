"use client";

import { useEffect, useState } from "react";

const PIN_EVENT = "nomadic:chrome-pin";
const SUPPRESS_EVENT = "nomadic:chrome-suppress";

// While pinned (nav-triggered navigation in flight), the nav and socials
// sidebar stay visible instead of hiding on scroll.
export function setChromePinned(pinned) {
  window.dispatchEvent(new CustomEvent(PIN_EVENT, { detail: pinned }));
}

// While suppressed (e.g. inside the gallery's pinned run), the sidebar is
// kept off screen even when scrolling stops.
export function setChromeSuppressed(suppressed) {
  window.dispatchEvent(new CustomEvent(SUPPRESS_EVENT, { detail: suppressed }));
}

const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

// Shared scroll behaviour for the top nav and socials sidebar.
// `scrolling` is driven by user INPUT (wheel/touch/keys), not scroll position
// — so the chrome slides back the moment the user stops scrolling, without
// waiting for Lenis easing to settle, and without flapping on its tail.
export default function useScrollState() {
  const [state, setState] = useState({
    scrolling: false,
    atTop: true,
    atBottom: false,
    suppressed: false,
  });

  useEffect(() => {
    let timer;
    let pinned = false;
    let scrolling = false;
    let suppressed = false;

    const measure = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const next = {
        scrolling: pinned ? false : scrolling,
        atTop: y < 60,
        atBottom: y + window.innerHeight >= doc.scrollHeight - 80,
        suppressed,
      };
      setState((prev) =>
        prev.scrolling === next.scrolling &&
        prev.atTop === next.atTop &&
        prev.atBottom === next.atBottom &&
        prev.suppressed === next.suppressed
          ? prev
          : next
      );
    };

    const onInput = () => {
      scrolling = true;
      measure();
      clearTimeout(timer);
      timer = setTimeout(() => {
        scrolling = false;
        measure();
      }, 180);
    };

    const onKey = (e) => {
      if (SCROLL_KEYS.has(e.key)) onInput();
    };

    const onPin = (e) => {
      pinned = e.detail;
      measure();
    };

    const onSuppress = (e) => {
      suppressed = e.detail;
      measure();
    };

    measure();
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchmove", onInput, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener(PIN_EVENT, onPin);
    window.addEventListener(SUPPRESS_EVENT, onSuppress);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchmove", onInput);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", measure);
      window.removeEventListener(PIN_EVENT, onPin);
      window.removeEventListener(SUPPRESS_EVENT, onSuppress);
    };
  }, []);

  return state;
}
