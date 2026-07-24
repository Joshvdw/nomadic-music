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

const SERVICES = [
  {
    title: "Sound Design",
    tag: "Custom UI Audio, Soundtracks",
    body: "From interactive websites and film to video games, podcast jingles and advertising, I bring years of production experience to creative or commercial audio projects for clients all over the globe.",
    Icon: WaveIcon,
    art: "/images/services/sound-design.jpg",
  },
  {
    title: "Mastering",
    tag: "Personal, Affordable",
    body: "With over a decade mastering my own releases & work for other artists, I offer a personal alternative to automated tools, without boutique-engineer pricing. Masters are built for streaming with optional stem-mixing available.",
    Icon: FadersIcon,
    art: "/images/services/mastering.jpg",
  },
  {
    title: "Private Tutoring",
    tag: "One-on-One, Tailored to You",
    body: "Online or in-person, covering everything from sound design and arrangement through to mixing, mastering and release. Tailored to what you're most interested in, we'll work together to develop your own music.",
    Icon: GradCapIcon,
    art: "/images/services/tutoring.jpg",
  },
  {
    title: "Design & Web",
    tag: "Creative Websites, Digital Experiences",
    body: "Beyond music, I'm a web designer and developer specialising in the creative space, crafting sites and digital experiences with a distinctive touch (such as this one). I also design album covers, posters and other artwork.",
    Icon: BezierIcon,
    // framed crop of the design collage — Wandering Mind centred with the
    // neighbouring posters peeking around the edges
    art: "/images/services/web-design-frame.jpg",
  },
].map((s) => ({ ...s, key: s.title }));

export default function Services() {
  // Enquire pre-selects the matching subject in the contact form below.
  const enquire = (service) => {
    window.dispatchEvent(
      new CustomEvent("nomadic:enquire", { detail: service }),
    );
  };

  return (
    <section
      id="services"
      className={`${styles.services} container`}
      aria-label="Services"
    >
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
              <Image
                src={art}
                alt=""
                fill
                sizes="30vw"
                className={styles.cardArtImg}
              />
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
