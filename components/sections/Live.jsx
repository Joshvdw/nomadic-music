"use client";

import { useEffect, useRef, useState } from "react";
import { SOUNDCLOUD_PLAYLIST_EMBED, LINKS } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import { ArrowRightIcon } from "@/components/Icons";
import styles from "./Live.module.css";

// Split section: full-bleed set footage left, DJ-sets column right.
// The right column scrolls up slightly faster than the video (parallax).
export default function Live() {
  const sectionRef = useRef(null);
  const setsRef = useRef(null);
  // portrait 9:16 montage for phones, landscape for everything else
  const [mobileVideo, setMobileVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobileVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        Math.min(
          1,
          (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2),
        ),
      );
      cur += (-p * 75 - cur) * 0.08;
      sets.style.transform = `translate3d(0, ${cur.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="live"
      ref={sectionRef}
      className={styles.live}
      aria-label="Festivals, gigs and DJ sets"
    >
      <div className={styles.videoCol}>
        <video
          key={mobileVideo ? "mobile" : "desktop"}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/gallery/laundry-dj-set.jpg"
          aria-label="Live DJ set montage"
        >
          <source
            src={
              mobileVideo
                ? "/videos/live-montage-mobile.mp4"
                : "/videos/live-montage-desktop.mp4"
            }
            type="video/mp4"
          />
        </video>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.caption} data-reveal>
          <h2 className={styles.captionHeading}>Festivals &amp; Gigs</h2>
          <p>
            Eclectic live sets at festivals like Luminate & Relish, resident at
            Wellington's Laundry and a regular at the Roots Bar in Takaka.
            Nomadic’s performances get bodies moving in any setting.
          </p>
        </div>
      </div>

      <div className={styles.setsCol}>
        <div ref={setsRef} className={styles.setsInner}>
          <div data-reveal>
            <h3 className={styles.setsHeading}>DJ Sets</h3>
            <p className={styles.setsBlurb}>
              Built around original music and ranging from peak-time dancefloor
              energy to slower, downtempo grooves, Nomadic's sets take listeners
              on an immersive journey across the sonic spectrum.
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
      </div>
    </section>
  );
}
