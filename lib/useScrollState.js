"use client";

import { useEffect, useState } from "react";

const PIN_EVENT = "nomadic:chrome-pin";

// While pinned (nav-triggered navigation in flight), the nav and socials
// sidebar stay visible instead of hiding on scroll.
export function setChromePinned(pinned) {
  window.dispatchEvent(new CustomEvent(PIN_EVENT, { detail: pinned }));
}

// Shared scroll behaviour for the top nav and socials sidebar:
//  - `scrolling`  true while the page is moving (hides both chrome pieces),
//    flips back shortly after movement stops (slight slide-in delay).
//  - `atTop`      viewport is at the landing position (both stay hidden).
//  - `atBottom`   scrolled to the end.
export default function useScrollState() {
  const [state, setState] = useState({
    scrolling: false,
    atTop: true,
    atBottom: false,
  });

  useEffect(() => {
    let timer;
    let lastY = window.scrollY;
    let pinned = false;

    const measure = (scrolling) => {
      const y = window.scrollY;
      const doc = document.documentElement;
      setState({
        scrolling: pinned ? false : scrolling,
        atTop: y < 60,
        atBottom: y + window.innerHeight >= doc.scrollHeight - 80,
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      // ignore sub-pixel jitter from Lenis easing tails
      if (Math.abs(y - lastY) > 1.5) {
        lastY = y;
        measure(true);
        clearTimeout(timer);
        timer = setTimeout(() => measure(false), 140);
      }
    };

    const onPin = (e) => {
      pinned = e.detail;
      measure(false);
    };

    measure(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(PIN_EVENT, onPin);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(PIN_EVENT, onPin);
    };
  }, []);

  return state;
}
