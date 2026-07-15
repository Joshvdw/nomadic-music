"use client";

// Collaborations — redesigned. To revert to the previous 4-up + 2-up grid,
// swap the import in app/page.js to `CollabsLegacy` (kept alongside).
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { TRACKS } from "@/lib/site";
import LazyEmbed from "@/components/LazyEmbed";
import { ArrowDownIcon } from "@/components/Icons";
import styles from "./Collabs.module.css";

const ARTISTS = [
  { key: "skysia", name: "Skysia", track: "Dusk - Nomadic Remix", image: "/images/collabs/skysia.jpg", alt: "Skysia" },
  { key: "ayla", name: "Ayla Nereo", track: "O Come Ye - Nomadic Remix", image: "/images/collabs/ayla.jpg", alt: "Ayla Nereo" },
  { key: "yamenjo", name: "Yamenjo", track: "Taita Inti - Nomadic Remix", image: "/images/collabs/yamenjo.jpg", alt: "Yamenjo" },
  { key: "scott", name: "Scott Nice", track: "Sparkle Adeline - Nomadic Remix", image: "/images/collabs/scott.jpg", alt: "Scott Nice" },
];

const LABELS = [
  {
    name: "Jumpsuit Records",
    image: "/images/collabs/jumpsuit-records.jpg",
    alt: "Jumpsuit Records logo",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?”",
  },
  {
    name: "High Vibe Records",
    image: "/images/collabs/high-vibe.jpg",
    alt: "High Vibe Records artwork",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?”",
  },
];

// crisp, perfectly-centred chevron (unicode guillemets sit off-centre)
function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// One card per view; swipe on touch, arrows / dots to click through.
function Carousel({ items, renderItem, label }) {
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const goto = useCallback(
    (i) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = (i + items.length) % items.length;
      track.scrollTo({ left: track.clientWidth * clamped, behavior: "smooth" });
    },
    [items.length]
  );

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIdx(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label={label}>
      <div ref={trackRef} className={styles.carTrack} onScroll={onScroll}>
        {items.map((it, i) => (
          <div key={i} className={styles.slide}>
            {renderItem(it)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className={styles.carNav}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goto(idx - 1)}
            aria-label="Previous"
          >
            <Chevron dir="left" />
          </button>
          <div className={styles.dots}>
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
                onClick={() => goto(i)}
                aria-label={`Go to ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goto(idx + 1)}
            aria-label="Next"
          >
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}

function ArtistCard({ it }) {
  return (
    <article className={`${styles.card} ${styles.artistCard}`}>
      <div className={styles.cardImg}>
        <Image src={it.image} alt={it.alt} fill sizes="18vw" className={styles.img} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <h3 className={styles.cardName}>{it.name}</h3>
          <p className={styles.cardTrack}>{it.track}</p>
        </div>
        <div className={styles.cardEmbed}>
          <LazyEmbed
            src={TRACKS[it.key].embed}
            title={`${it.name} — ${it.track} — Spotify player`}
            height={80}
            radius={4}
          />
        </div>
      </div>
    </article>
  );
}

function LabelCard({ it }) {
  return (
    <article className={`${styles.card} ${styles.labelCard}`}>
      <div className={styles.cardImg}>
        <Image src={it.image} alt={it.alt} fill sizes="18vw" className={styles.img} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{it.name}</h3>
        <p className={styles.cardText}>{it.body}</p>
      </div>
    </article>
  );
}

export default function Collabs() {
  return (
    <section id="collabs" className={`${styles.collabs} container`} aria-label="Collaborations">
      <header className={styles.header} data-reveal>
        <div className={styles.headerText}>
          <p className={`eyebrow ${styles.sub}`}>Make something together</p>
          <h2 className={styles.heading}>Collaborations</h2>
        </div>
        <a
          className={styles.enquireLink}
          href="#contact"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("nomadic:enquire", { detail: "Collaboration" })
            )
          }
        >
          Want to collaborate?
          <ArrowDownIcon className={styles.enquireArrow} />
        </a>
      </header>

      <div className={styles.columns} data-reveal>
        <div className={styles.column}>
          <span className={styles.colLabel}>Artists</span>
          <Carousel items={ARTISTS} label="Artist collaborations" renderItem={(it) => <ArtistCard it={it} />} />
        </div>
        <div className={styles.column}>
          <span className={styles.colLabel}>Labels</span>
          <Carousel items={LABELS} label="Record labels" renderItem={(it) => <LabelCard it={it} />} />
        </div>
      </div>

    </section>
  );
}
