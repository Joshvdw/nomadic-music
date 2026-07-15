"use client";

// =============================================================================
// TEST HERO — interactive chrome orb over the mountain background.
// This is an EXPERIMENTAL replacement for the original <Hero />. The original
// is preserved (commented out in app/page.js and rendered verbatim as the
// mobile fallback below). To restore it: uncomment <Hero /> in page.js and
// remove <OrbHero /> — no flags, no env toggles.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "./Hero";
import styles from "./OrbHero.module.css";

// three.js only loads on desktop, client-side — never on the server or the
// mobile fallback path.
const OrbScene = dynamic(() => import("./OrbScene"), { ssr: false });

// Below this width we do NOT run the live canvas (GPU cost on phones).
const MOBILE_MAX = 767;

// How much the reflected scene turns per pixel of horizontal drag (radians/px).
// Kept subtle — this is ambience, not a product viewer. (Auto-rotate speed and
// mirror roughness are tunables at the top of OrbScene.jsx.)
const DRAG_SENSITIVITY = 0.006;

export default function OrbHero() {
  // null → undecided (SSR + first client paint, canvas not yet mounted)
  // "orb" → desktop, mount the live canvas
  // "fallback" → mobile, render the original <Hero />
  const [mode, setMode] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotionRef = useRef(false);

  // Shared drag state — mutated by the DOM pointer handlers below and read by
  // the Orb's useFrame inside the Canvas. { active, lastX, delta }.
  const dragState = useRef({ active: false, lastX: 0, delta: 0 });

  // Decide orb vs fallback, and keep it live across resizes/orientation.
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const apply = () => setMode(mq.matches ? "fallback" : "orb");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Load-in choreography (matches the original hero's type reveal).
  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Scroll hint disappears as soon as the user scrolls.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SCROLL HOOK (GSAP ScrollTrigger is already in the project) — not built this
  // pass. Future: drive orb rotation/scale or a parallax dissolve on scroll.

  // -- constrained drag: Y-axis rotation only, auto-rotate resumes on release --
  const onPointerDown = (e) => {
    dragState.current.active = true;
    dragState.current.lastX = e.clientX;
    dragState.current.delta = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.lastX;
    dragState.current.lastX = e.clientX;
    dragState.current.delta += dx * DRAG_SENSITIVITY;
  };
  const endDrag = (e) => {
    dragState.current.active = false;
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  // MOBILE FALLBACK — decide: static orb image vs original hero.
  // Safe default for now = the original animated hero, fully replacing this
  // component so the R3F canvas never mounts (no GPU cost on phones).
  if (mode === "fallback") return <Hero />;

  return (
    <section
      className={`${styles.hero} ${loaded ? styles.loaded : ""}`}
      aria-label="Nomadic — introduction"
    >
      {/* CSS background — the same mountain image the orb reflects, framed to
          match the original hero. Sits behind the transparent canvas. */}
      <div className={styles.bgLayer} aria-hidden="true" />

      {/* Live canvas — desktop only. Reveals with the type layer via .loaded. */}
      {mode === "orb" && (
        <div
          className={styles.canvasLayer}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <OrbScene
            dragState={dragState}
            reducedMotion={reducedMotionRef.current}
          />
        </div>
      )}

      {/* Type layer — sits above the canvas, unchanged from the original. */}
      <div className={`${styles.copy} container`}>
        <div className={styles.copyBlock}>
          <h1 className={styles.title}>Nomadic</h1>
          <p className={styles.tagline}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <div
        className={`${styles.scrollHint} ${scrolled ? styles.hintHidden : ""}`}
        aria-hidden="true"
      >
        <span className={styles.hintLabel}>
          <span className={styles.labelScroll}>Scroll</span>
          <span className={styles.labelSwipe}>Swipe</span>
        </span>
        <span className={styles.hintLine} />
      </div>
    </section>
  );
}
