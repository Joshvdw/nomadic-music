"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { TRACKS } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import styles from "./Collabs.module.css";

const ARTISTS = [
  {
    key: "skysia",
    name: "Skysia",
    track: "Lost Dreams (Skysia Remix)",
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
    key: "yamenjo",
    name: "Yamenjo",
    track: "Taita Inti (Nomadic Remix)",
    image: "/images/collabs/yamenjo.jpg",
    alt: "Yamenjo duo performing with live instruments and decks",
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
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?”",
  },
  {
    name: "High Vibe Records",
    image: "/images/collabs/high-vibe.jpg",
    alt: "High Vibe Records artwork — mirrored mountain rising into clouds",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?”",
  },
];

export default function Collabs() {
  const artistsRef = useRef(null);
  const labelsRef = useRef(null);

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
        list.children[originals.length].offsetLeft - list.children[0].offsetLeft;
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
    <section id="collabs" className={`${styles.collabs} container`} aria-label="Collaborations">
      <header className={styles.header} data-reveal>
        <Image
          src="/images/decals/collabs.png"
          alt=""
          width={1026}
          height={124}
          className={`decal ${styles.headerDecal}`}
        />
        <h2 className={styles.heading}>Collaborations</h2>
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
                <span className={styles.artistTrack}>{track}</span>
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

      <ul ref={labelsRef} className={styles.labelGrid} data-reveal="cascade">
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
      </ul>

      <p className={styles.swipeHint} aria-hidden="true">
        Swipe
      </p>
    </section>
  );
}
