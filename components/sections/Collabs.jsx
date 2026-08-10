"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { TRACKS } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import { ArrowRightIcon } from "@/components/Icons";
import CollabCta from "./CollabCta";
import styles from "./Collabs.module.css";

const ARTISTS = [
  {
    key: "skysia",
    name: "Skysia",
    track: "Dusk (Nomadic Remix)",
    image: "/images/collabs/skysia.jpg",
    alt: "Skysia DJing to a festival crowd in daylight",
  },
  {
    key: "ayla",
    name: "Ayla Nereo",
    track: "O Come Ye (Nomadic Remix)",
    image: "/images/collabs/ayla.jpg",
    alt: "Ayla Nereo singing on stage under purple lights",
  },
  {
    key: "yemanjo",
    name: "Yemanjo",
    track: "Taita Inti (Nomadic Remix)",
    image: "/images/collabs/yamenjo.jpg",
    alt: "Yemanjo duo performing with live instruments and decks",
  },
  {
    key: "scott",
    name: "Scott Nice",
    track: "Sparkle Adeline (Nomadic Remix)",
    image: "/images/collabs/scott.jpg",
    alt: "Scott Nice performing behind ornate stage design in red light",
  },
];

export default function Collabs() {
  const artistsRef = useRef(null);

  // The CTA used to be wiped in by an observer on the artist grid above it.
  // The grid is taller than the viewport, so that fired while the CTA was
  // still 1–2 screens down and the wipe was always over before anyone saw
  // it. The shared RevealManager triggers it on its own edge instead.

  // Phones: turn the artist row into a seamless infinite loop. A cloned set
  // sits on each side of the originals (iframes stripped from clones); when
  // the scroll position drifts past half a period either way it jumps by
  // exactly one period — imperceptible, and swiping works in both
  // directions from the start.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    const cleanups = [artistsRef.current].map((list) => {
      if (!list) return () => {};
      const originals = [...list.children];
      const makeClone = (node) => {
        const c = node.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        c.querySelectorAll("iframe").forEach((f) => f.remove());
        return c;
      };
      originals.forEach((n) => list.appendChild(makeClone(n)));
      [...originals]
        .reverse()
        .forEach((n) => list.insertBefore(makeClone(n), list.firstChild));

      // exact pitch of one card set (offset between the clone set and the
      // originals) — jumps stay snap-aligned, so no skipped cards
      const period =
        list.children[originals.length].offsetLeft -
        list.children[0].offsetLeft;
      list.scrollLeft = period;

      const onScroll = () => {
        if (list.scrollLeft < period * 0.5) list.scrollLeft += period;
        else if (list.scrollLeft > period * 2) list.scrollLeft -= period;
      };
      list.addEventListener("scroll", onScroll, { passive: true });
      return () => list.removeEventListener("scroll", onScroll);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      id="collabs"
      className={`${styles.collabs} container`}
      aria-label="Collaborations"
    >
      <header className={styles.header} data-reveal>
        <div className={styles.headerText}>
          <p className={`eyebrow ${styles.sub}`}>Make something together</p>
          <h2 className={styles.heading}>Collaborations</h2>
        </div>
        <a
          className={styles.viewAll}
          href="https://open.spotify.com/playlist/38NKDnaVjgZMMM2NkOZCbg?si=a30f0c0499d146bc"
          target="_blank"
          rel="noopener noreferrer"
        >
          View full collab playlist
          <ArrowRightIcon className={styles.viewAllArrow} />
        </a>
      </header>

      <ul ref={artistsRef} className={styles.artistGrid} data-reveal="cascade">
        {ARTISTS.map(({ key, name, track, image, alt }) => (
          <li key={key} className={styles.artistCard}>
            <div className={styles.artistImageWrap}>
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1490px) 46vw, 20vw"
                className={styles.artistImage}
              />
              <div className={styles.artistMeta}>
                <span className={styles.artistName}>{name}</span>
              </div>
            </div>
            <div className={styles.cardEmbed}>
              <LazyEmbed
                src={TRACKS[key].embed}
                title={`${name} — ${track} — Spotify player`}
                height={80}
                radius={0}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.swipeHint} aria-hidden="true" data-reveal="fade">
        Swipe
      </p>

      <div className={styles.ctaInterlude}>
        <CollabCta />
      </div>
    </section>
  );
}
