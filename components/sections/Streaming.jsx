"use client";

import { useEffect, useRef } from "react";
import { SPOTIFY_ARTIST_EMBED } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import styles from "./Streaming.module.css";

const STATS = [
  { value: 200, suffix: "k+", label: "Monthly Listeners" },
  { value: 15, suffix: " Million", label: "Cross-platform Streams" },
  { value: 20, suffix: "k+", label: "Followers" },
];

export default function Streaming() {
  const sectionRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // grain rides the scroll: default at the section's edges, full strength
    // when it's centred — a smooth bell over the pass-through
    const root = document.documentElement;
    const BASE = 0.05;
    let grainRaf;
    let cur = BASE;
    if (!reduced) {
      const grainLoop = () => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const v = Math.max(
          0,
          Math.min(1, (vh - rect.top) / (rect.height + vh))
        );
        const target = BASE + (1 - BASE) * Math.sin(Math.PI * v);
        cur += (target - cur) * 0.12;
        root.style.setProperty("--grain-opacity", cur.toFixed(3));
        grainRaf = requestAnimationFrame(grainLoop);
      };
      grainRaf = requestAnimationFrame(grainLoop);
    }

    // count-up once the stats row enters the viewport
    let counted = false;
    const countIO = new IntersectionObserver(
      (entries) => {
        if (counted || !entries.some((e) => e.isIntersecting)) return;
        counted = true;
        countIO.disconnect();
        STATS.forEach((stat, i) => {
          const el = statRefs.current[i];
          if (!el) return;
          if (reduced) {
            el.textContent = `${stat.value}${stat.suffix}`;
            return;
          }
          const delay = 500;
          const dur = 3200;
          const t0 = performance.now() + delay;
          const tick = (now) => {
            const p = Math.min(1, Math.max(0, (now - t0) / dur));
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            el.textContent = `${Math.round(stat.value * eased)}${stat.suffix}`;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    countIO.observe(section);

    return () => {
      cancelAnimationFrame(grainRaf);
      countIO.disconnect();
      root.style.removeProperty("--grain-opacity");
    };
  }, []);

  return (
    <section
      id="streaming"
      ref={sectionRef}
      className={styles.streaming}
      aria-label="Streaming statistics"
    >
      <div className={styles.bg} data-reveal="fade" data-reveal-late="" aria-hidden="true" />
      {/* the whole block fades in as one — no slide (unique to this section) */}
      <div className={`${styles.inner} container`} data-reveal="fade" data-reveal-late="">
        <div className={styles.textCol}>
          <h2 className={styles.heading}>Streaming</h2>
          <p className={styles.blurb}>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit
            esse quam nihil molestiae consequatur, vel illum qui dolorem eum
            fugiat quo voluptas nulla pariatur?&rdquo;
          </p>
          <dl className={styles.stats}>
            {STATS.map((stat, i) => (
              <div key={stat.label} className={styles.stat}>
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className={styles.statValue}
                  ref={(el) => (statRefs.current[i] = el)}
                >
                  {stat.value}
                  {stat.suffix}
                </dd>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.embedCol}>
          <LazyEmbed
            src={SPOTIFY_ARTIST_EMBED}
            title="Nomadic on Spotify — top tracks"
            height={352}
          />
        </div>
      </div>
    </section>
  );
}
