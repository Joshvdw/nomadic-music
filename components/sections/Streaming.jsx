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

    // grain overlay ramps to full strength while this section is in view
    const grainIO = new IntersectionObserver(
      (entries) => {
        document.documentElement.classList.toggle(
          "grain-max",
          entries.some((e) => e.isIntersecting)
        );
      },
      { threshold: 0.35 }
    );
    grainIO.observe(section);

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
          const t0 = performance.now();
          const dur = 1500;
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
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
      grainIO.disconnect();
      countIO.disconnect();
      document.documentElement.classList.remove("grain-max");
    };
  }, []);

  return (
    <section
      id="streaming"
      ref={sectionRef}
      className={styles.streaming}
      aria-label="Streaming statistics"
    >
      <div className={styles.bg} data-reveal="fade" aria-hidden="true" />
      <div className={`${styles.inner} container`}>
        <div className={styles.textCol}>
          <h2 className={styles.heading} data-reveal="fast">
            Streaming
          </h2>
          <p className={styles.blurb} data-reveal="fast" style={{ "--reveal-delay": ".08s" }}>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit
            esse quam nihil molestiae consequatur, vel illum qui dolorem eum
            fugiat quo voluptas nulla pariatur?&rdquo;
          </p>
          <dl className={styles.stats} data-reveal="fast" style={{ "--reveal-delay": ".16s" }}>
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

        <div className={styles.embedCol} data-reveal="fast" style={{ "--reveal-delay": ".2s" }}>
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
