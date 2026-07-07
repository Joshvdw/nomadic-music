"use client";

import { useEffect, useRef } from "react";
import { SOUNDCLOUD_PLAYLIST_EMBED, LINKS } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import { ArrowRightIcon } from "@/components/Icons";
import styles from "./Live.module.css";

// Split section: full-bleed set footage left, DJ-sets column right.
// The right column scrolls up slightly faster than the video (parallax).
export default function Live() {
  const sectionRef = useRef(null);
  const setsRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const section = sectionRef.current;
    const sets = setsRef.current;
    let rafId;
    let cur = 0;

    // continuous heavy-eased parallax: the DJ-sets column drifts up faster
    // than the video, easing toward its target every frame
    const loop = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 → section below viewport, +1 → above; 0 → centred
      const p = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2))
      );
      cur += (-p * 75 - cur) * 0.08;
      sets.style.transform = `translate3d(0, ${cur.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="live" ref={sectionRef} className={styles.live} aria-label="Festivals, gigs and DJ sets">
      <div className={styles.videoCol}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/gallery/dj-set-closeup.jpg"
          aria-label="Live DJ set montage"
        >
          <source src="/videos/dj-video.mp4" type="video/mp4" />
        </video>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.caption} data-reveal>
          <h2 className={styles.captionHeading}>Festivals &amp; Gigs</h2>
          <p>
            From Luminate on Takaka Hill to Relish Festival and late rooms
            across the Top of the South — sets built to move outdoor
            dancefloors, dusk till dawn.
          </p>
        </div>
      </div>

      <div className={styles.setsCol}>
        <div ref={setsRef} className={styles.setsInner}>
          <div data-reveal>
            <h3 className={styles.setsHeading}>DJ Sets</h3>
            <p className={styles.setsBlurb}>
              Recorded in the field: full-length sets from Rhythm &amp; Roots,
              Relish Festival and Luminate&rsquo;s Chillounge — mid-tempo
              journeys through psy-dub, tribal techno and bass. Press play and
              judge the room for yourself.
            </p>
          </div>
          <div className={styles.embed} data-reveal>
            <LazyEmbed
              src={SOUNDCLOUD_PLAYLIST_EMBED}
              title="Nomadic DJ sets — SoundCloud playlist"
              height={450}
              radius={4}
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
        {/* outside the parallax layer: bottom-aligned with the caption at left */}
        <a
          className={styles.scLink}
          href={LINKS.soundcloud}
          target="_blank"
          rel="noopener noreferrer"
        >
          View SoundCloud
          <ArrowRightIcon className={styles.scArrow} />
        </a>
      </div>
    </section>
  );
}
