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

const LABELS = [
  {
    name: "Jumpsuit Records",
    image: "/images/collabs/jumpsuit-records.jpg",
    alt: "Jumpsuit Records logo over a misty forest",
    body: "Released several records through US label Jumpsuit Records, including debut album 'Wandering Mind', followed by 'Ennui' and the 'Tessera EP'.",
  },
  {
    name: "High Vibe Records",
    image: "/images/collabs/high-vibe.jpg",
    alt: "High Vibe Records artwork — mirrored mountain rising into clouds",
    body: "Collaborated with singer-songwriter Hayley Harkin on a release through High Vibe Records, pairing her soulful, poetic vocals with contemporary electronic music production.",
  },
];

export default function Collabs() {
  const artistsRef = useRef(null);
  const labelsRef = useRef(null);
  const ctaRef = useRef(null);

  // Reveal the CTA at the same scroll point as the artist cards above it:
  // watch the artist grid and, the moment it enters, wipe the CTA in too
  // (the shared RevealManager would otherwise trigger it lower down).
  useEffect(() => {
    const grid = artistsRef.current;
    const wipe = ctaRef.current?.querySelector('[data-reveal="wipe"]');
    if (!grid || !wipe) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          wipe.classList.add("is-inview");
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  // Phones: turn both card rows into seamless infinite loops. A cloned set
  // sits on each side of the originals (iframes stripped from clones); when
  // the scroll position drifts past half a period either way it jumps by
  // exactly one period — imperceptible, and swiping works in both
  // directions from the start.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    const cleanups = [artistsRef.current, labelsRef.current].map((list) => {
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
          View full playlist
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

      <p className={styles.swipeHint} aria-hidden="true">
        Swipe
      </p>

      <div ref={ctaRef} className={styles.ctaInterlude}>
        <CollabCta />
      </div>

      {/* <ul ref={labelsRef} className={styles.labelGrid} data-reveal="cascade">
        {LABELS.map(({ name, image, alt, body }) => (
          <li key={name} className={styles.labelCard}>
            <div className={styles.labelImageWrap}>
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 900px) 92vw, 18vw"
                className={styles.labelImage}
              />
            </div>
            <div className={styles.labelBody}>
              <h3 className={styles.labelName}>{name}</h3>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ul> */}

      <p className={styles.swipeHint} aria-hidden="true">
        Swipe
      </p>
    </section>
  );
}
