"use client";

import { useEffect, useState } from "react";

// Shared scroll behaviour for the top nav and socials sidebar:
//  - `scrolling`  true while the page is moving (hides both chrome pieces),
//    flips back ~250ms after movement stops (the "slight delay" slide-in).
//  - `atTop`      viewport is at the landing position (nav stays hidden).
//  - `atBottom`   scrolled to the end (sidebar expanded state).
export default function useScrollState() {
  const [state, setState] = useState({
    scrolling: false,
    atTop: true,
    atBottom: false,
  });

  useEffect(() => {
    let timer;
    let lastY = window.scrollY;

    const measure = (scrolling) => {
      const y = window.scrollY;
      const doc = document.documentElement;
      setState({
        scrolling,
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
        timer = setTimeout(() => measure(false), 260);
      }
    };

    measure(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return state;
}
