"use client";

import Image from "next/image";
import {
  WaveIcon,
  FadersIcon,
  MetronomeIcon,
  BezierIcon,
  ArrowDownIcon,
} from "@/components/Icons";
import styles from "./Services.module.css";

const SERVICES = [
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
    Icon: MetronomeIcon,
  },
  {
    title: "Design & Web",
    tag: "Posters, Artwork & Sites",
    body: "Gig posters, cover art and artist websites — the same eye that shapes Nomadic's visual world, applied to yours.",
    Icon: BezierIcon,
  },
];

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
          className="decal"
        />
        <h2 className={styles.heading}>Also Available For</h2>
      </header>

      <ul className={styles.grid} data-reveal="cascade">
        {SERVICES.map(({ title, tag, body, Icon }) => (
          <li key={title} className={styles.card}>
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
