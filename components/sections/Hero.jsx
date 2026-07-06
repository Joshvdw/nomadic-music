"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

// Full-viewport layered hero:
//   background                → mouse-move parallax (lerped)
//   ball + reflection shift   → autonomous floating drift
//   shadow (above the ball)   → tracks the ball with a slight lag, shading
//                               its bright right side like a soft shadow
// All layers render slightly larger than the viewport for travel room.
export default function Hero() {
  const bgRef = useRef(null);
  const ballRef = useRef(null);
  const shadowRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // load-in choreography starts once mounted (CSS transitions from here)
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // scroll hint disappears as soon as the user scrolls
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bg = bgRef.current;
    const ball = ballRef.current;
    const shadow = shadowRef.current;
    let rafId;

    // --- mouse parallax state (background only) ---
    let px = 0;
    let py = 0;
    let tpx = 0;
    let tpy = 0;

    const onMove = (e) => {
      tpx = (e.clientX / window.innerWidth - 0.5) * -14;
      tpy = (e.clientY / window.innerHeight - 0.5) * -10;
    };

    // --- ball floating drift: eased travel between random waypoints ---
    const rand = (a, b) => a + Math.random() * (b - a);
    const waypoint = () => ({
      x: Math.random() < 0.45 ? rand(-8, 8) : 0,
      y: rand(-14, 14),
    });
    let from = { x: 0, y: 0 };
    let to = waypoint();
    let start = performance.now();
    let dur = rand(2800, 4600);
    const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    // scroll parallax: the ball lags the page slightly as the hero scrolls
    // away, smoothed so it feels weightless rather than pinned
    let sy = 0;

    const loop = (now) => {
      px += (tpx - px) * 0.045;
      py += (tpy - py) * 0.045;
      bg.style.transform = `translate3d(${px}px, ${py}px, 0)`;

      let t = (now - start) / dur;
      if (t >= 1) {
        from = to;
        to = waypoint();
        start = now;
        dur = rand(2800, 4600);
        t = 0;
      }
      const e = easeInOut(t);
      const bx = from.x + (to.x - from.x) * e;
      const by = from.y + (to.y - from.y) * e;

      sy += (window.scrollY * 0.14 - sy) * 0.08;

      ball.style.transform = `translate3d(${bx}px, ${(by + sy).toFixed(2)}px, 0)`;
      // shadow lags the ball a touch, like shading catching up
      shadow.style.transform = `translate3d(${(bx * 0.8).toFixed(2)}px, ${(by * 0.85 + sy * 0.9).toFixed(2)}px, 0)`;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      className={`${styles.hero} ${loaded ? styles.loaded : ""}`}
      aria-label="Nomadic — introduction"
    >
      <div ref={bgRef} className={styles.bgLayer}>
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Golden mountain ranges at dusk under a soft sky"
          fill
          priority
          fetchPriority="high"
          quality={100}
          sizes="110vw"
          className={styles.bgImg}
        />
      </div>

      <div ref={ballRef} className={styles.ballLayer}>
        <Image
          src="/images/hero/ball.png"
          alt="A glassy obsidian sphere reflecting the landscape"
          fill
          priority
          quality={100}
          sizes="110vw"
          className={styles.bgImg}
        />
      </div>

      <div ref={shadowRef} className={styles.shadowLayer}>
        <Image
          src="/images/hero/ball-shadow.png"
          alt=""
          fill
          priority
          quality={100}
          sizes="110vw"
          className={styles.bgImg}
        />
      </div>

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
        <span className={styles.hintLabel}>Scroll</span>
        <span className={styles.hintLine} />
      </div>
    </section>
  );
}
