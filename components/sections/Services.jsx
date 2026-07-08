"use client";

import Image from "next/image";
import {
  WaveIcon,
  FadersIcon,
  GradCapIcon,
  BezierIcon,
  ArrowDownIcon,
} from "@/components/Icons";
import styles from "./Services.module.css";

// Four services; tripled into 12 cards so every candidate art image can be
// previewed in situ (pick favourites later, then trim back to four).
const BASE_SERVICES = [
  {
    title: "Sound Design",
    tag: "Textures, Palettes & Worlds",
    body: "Bespoke sound palettes and transitions for artists, film and interactive work — sculpted from field recordings, resampling and synthesis.",
    Icon: WaveIcon,
  },
  {
    title: "Mastering",
    tag: "Warm, Loud, Translation-Proof",
    body: "Masters for electronic music that hold up on festival rigs and phone speakers alike — informed by years of releasing club-ready records.",
    Icon: FadersIcon,
  },
  {
    title: "Private Tutoring",
    tag: "One-on-One, in Ableton Live",
    body: "Production mentoring shaped to where you are — arrangement, sound design, mixing, and the harder art of finishing tracks that feel like you.",
    Icon: GradCapIcon,
  },
  {
    title: "Design & Web",
    tag: "Posters, Artwork & Sites",
    body: "Gig posters, cover art and artist websites — the same eye that shapes Nomadic's visual world, applied to yours.",
    Icon: BezierIcon,
  },
];

const ART = [
  "/images/services/pexels-cottonbro-7097832.jpg",
  "/images/services/pexels-anna-pou-8133000.jpg",
  "/images/services/pexels-bylukemiller-13811121.jpg",
  "/images/services/pexels-vollume-7123343.jpg",
  "/images/services/pexels-john-taran-166597215-11044764.jpg",
  "/images/services/pexels-john-taran-166597215-11044812.jpg",
  "/images/services/pexels-kaiser-leo-xiv-173738285-28003181.jpg",
  "/images/services/pexels-karina-lysenko-775004911-20142584.jpg",
  "/images/services/pexels-llane-a-3825752.jpg",
  "/images/services/pexels-norman-balian-1216644-15670390.jpg",
  "/images/services/654647589_1554742613321217_5101307390273466823_n.jpg",
  "/images/services/12-3-blog_1600x800_QTmVNhb.jpg__1600x800_q85_subsampling-2.jpg",
];

// three passes through the four services, each pass with fresh art
const SERVICES = ART.map((art, i) => ({
  ...BASE_SERVICES[i % BASE_SERVICES.length],
  art,
  key: `${BASE_SERVICES[i % BASE_SERVICES.length].title}-${i}`,
}));

export default function Services() {
  // Enquire pre-selects the matching subject in the contact form below.
  const enquire = (service) => {
    window.dispatchEvent(
      new CustomEvent("nomadic:enquire", { detail: service })
    );
  };

  return (
    <section id="services" className={`${styles.services} container`} aria-label="Services">
      <header className={styles.header} data-reveal>
        <Image
          src="/images/decals/services.png"
          alt=""
          width={1074}
          height={92}
          className={`decal ${styles.headerDecal}`}
        />
        <h2 className={styles.heading}>Also Available For</h2>
      </header>

      <ul className={styles.grid} data-reveal="cascade">
        {SERVICES.map(({ title, tag, body, Icon, art, key }) => (
          <li key={key} className={styles.card}>
            <div className={styles.cardArt} aria-hidden="true">
              <Image src={art} alt="" fill sizes="30vw" className={styles.cardArtImg} />
            </div>
            <Icon className={styles.icon} />
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.tag}>{tag}</p>
            <p className={styles.body}>{body}</p>
            <a
              className={styles.enquire}
              href="#contact"
              onClick={() => enquire(title)}
            >
              Enquire
              <ArrowDownIcon className={styles.arrow} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
