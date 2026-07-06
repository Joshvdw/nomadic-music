"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

// Full-viewport layered hero:
//   background + baked ground shadow  → mouse-move parallax (lerped)
//   ball (transparent layer)          → autonomous floating drift
// Both layers render slightly larger than the viewport for travel room.
export default function Hero() {
  const bgRef = useRef(null);
  const ballRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // load-in choreography starts once mounted (CSS transitions from here)
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bg = bgRef.current;
    const ball = ballRef.current;
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
      x: Math.random() < 0.4 ? rand(-5, 5) : 0,
      y: rand(-9, 9),
    });
    let from = { x: 0, y: 0 };
    let to = waypoint();
    let start = performance.now();
    let dur = rand(3000, 5000);
    const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    const loop = (now) => {
      px += (tpx - px) * 0.045;
      py += (tpy - py) * 0.045;
      bg.style.transform = `translate3d(${px}px, ${py}px, 0)`;

      let t = (now - start) / dur;
      if (t >= 1) {
        from = to;
        to = waypoint();
        start = now;
        dur = rand(3000, 5000);
        t = 0;
      }
      const e = easeInOut(t);
      const bx = from.x + (to.x - from.x) * e;
      const by = from.y + (to.y - from.y) * e;
      ball.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

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

      <div className={`${styles.copy} container`}>
        <div className={styles.copyBlock}>
          <h1 className={styles.title}>Nomadic</h1>
          <p className={styles.tagline}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </section>
  );
}
