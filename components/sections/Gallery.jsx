"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { EMAIL } from "@/lib/site";
import styles from "./Gallery.module.css";

// Horizontal, scroll-driven archive. The viewport pins while vertical scroll
// translates a bento-grid track sideways, ending with the bookings CTA centred
// on screen. Falls back to native horizontal swipe on mobile / reduced motion.
//
// Bento: flex row of column groups; each group is a stack of 1–2 tiles with
// consistent 1rem gaps, sized by --w (width) and per-tile --h (height share).

const G = "/images/gallery";

const GROUPS = [
  {
    w: 42,
    tiles: [
      { src: `${G}/relish-festival-live-1.jpg`, cap: "Relish Festival — live", alt: "Nomadic performing at Relish Festival, hands raised over the decks", h: 100 },
    ],
  },
  {
    w: 56,
    tiles: [
      { src: `${G}/laundry-bar-dj.jpg`, cap: "Laundry Bar", alt: "Nomadic DJing at Laundry Bar in warm light", h: 50 },
      { src: `${G}/roots-bar-decks.jpg`, cap: "Roots Bar — Tākaka", alt: "Back-to-back DJ set at Roots Bar, Tākaka", h: 50 },
    ],
  },
  {
    w: 38,
    tiles: [
      { src: `${G}/roots-and-rhythms-poster.png`, cap: "Roots & Rhythms — Tākaka", alt: "Roots and Rhythms event poster", h: 42 },
      { src: `${G}/roots-bar-rave-poster.jpg`, cap: "Roots Bar Rave", alt: "Roots Bar Rave event poster", h: 58 },
    ],
  },
  {
    w: 86,
    tiles: [
      { src: `${G}/luminate-chillounge-dj.jpg`, cap: "Chillounge — Luminate Festival", alt: "Nomadic DJing the Chillounge stage at Luminate Festival", h: 100 },
    ],
  },
  {
    w: 44,
    tiles: [
      { src: `${G}/luminate-programme.jpg`, cap: "Luminate — programme", alt: "Luminate Festival programme booklet featuring Nomadic", h: 42 },
      { src: `${G}/relish-festival-poster.jpg`, cap: "Relish Festival — lineup", alt: "Relish Festival lineup poster", h: 58 },
    ],
  },
  {
    w: 56,
    tiles: [
      { src: `${G}/festival-stage.jpg`, cap: "In the field", alt: "Festival stage and crowd at dusk", h: 50 },
      { src: `${G}/badgernomics-poster.jpg`, cap: "Badgernomics — Laundry Bar", alt: "Badgernomics Presents event poster", h: 50 },
    ],
  },
  {
    w: 42,
    tiles: [
      { src: `${G}/wandering-mind-release-poster.jpg`, cap: "Wandering Mind — album release", alt: "Wandering Mind album release party poster", h: 100 },
    ],
  },
  {
    w: 52,
    tiles: [
      { src: `${G}/boogie-house-poster.jpg`, cap: "Boogie House — Laundry Bar", alt: "Boogie House event poster", h: 50 },
      { src: `${G}/luminate-artist-page.jpg`, cap: "Luminate — artist page", alt: "Nomadic's artist page on the Luminate Festival website", h: 50 },
    ],
  },
  {
    w: 40,
    tiles: [
      { src: `${G}/spirit-level-release-poster.jpg`, cap: "Spirit Level — release party", alt: "Spirit Level album release party poster", h: 100 },
    ],
  },
  {
    w: 44,
    tiles: [
      { src: `${G}/double-bill-poster.png`, cap: "Double bill — Laundry Bar", alt: "Double-bill event poster, Laundry Bar", h: 58 },
      { src: `${G}/relish-festival-live-2.jpg`, cap: "Relish Festival — after dark", alt: "Nomadic behind the decks at Relish Festival at night", h: 42 },
    ],
  },
];

export default function Gallery() {
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const ctaRef = useRef(null);
  const progressRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
    );
    const pin = pinRef.current;
    const track = trackRef.current;
    const head = headRef.current;
    const cta = ctaRef.current;
    const progress = progressRef.current;
    const fadeEls = fadeRef.current.querySelectorAll(`.${styles.group}`);
    let active = false;
    let rafId = null;

    // horizontal distance: ends with the CTA centred on screen
    const overflow = () =>
      Math.max(0, cta.offsetLeft + cta.offsetWidth / 2 - window.innerWidth / 2);

    const measure = () => {
      if (!desktop.matches) {
        active = false;
        pin.style.height = "";
        track.style.transform = "";
        head.style.opacity = "";
        progress.parentElement.style.opacity = "";
        fadeEls.forEach((el) => (el.style.opacity = ""));
        return;
      }
      active = true;
      const dwell = Math.round(window.innerHeight * 0.35);
      pin.style.height = `${overflow() + window.innerHeight + dwell}px`;
      pin.dataset.dwell = dwell;
      update();
    };

    const update = () => {
      rafId = null;
      if (!active) return;
      const rect = pin.getBoundingClientRect();
      const dwell = parseInt(pin.dataset.dwell, 10) || 0;
      const scrollable = pin.offsetHeight - window.innerHeight - dwell;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      const ox = overflow();
      track.style.transform = `translate3d(${-p * ox}px, 0, 0)`;

      // archive title: hidden until horizontal scroll starts
      const titleIn = Math.min(1, p * 14);

      // everything fades as the bookings CTA crosses the screen
      const ctaLeft = cta.getBoundingClientRect().left;
      const vw = window.innerWidth;
      const fade =
        1 - Math.max(0, Math.min(1, (vw - ctaLeft) / (vw * 0.62)));

      head.style.opacity = (titleIn * fade).toFixed(3);
      progress.parentElement.style.opacity = fade.toFixed(3);
      fadeEls.forEach((el) => (el.style.opacity = fade.toFixed(3)));
      progress.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const onScroll = () => {
      if (active && rafId === null) rafId = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    // group widths are vh-based, but re-measure after images settle anyway
    const t = setTimeout(measure, 500);

    return () => {
      clearTimeout(t);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section id="gallery" className={styles.gallery} aria-label="Gallery — live archive">
      <div ref={pinRef} className={styles.pin}>
        <div ref={viewportRef} className={styles.viewport}>
          <header ref={headRef} className={styles.head}>
            <span className="eyebrow">
              <span className={styles.headLine} aria-hidden="true" />
              Archive
            </span>
            <h2 className={styles.heading}>Gallery</h2>
            <span className={styles.hint} aria-hidden="true">
              Scroll
            </span>
          </header>

          <div ref={fadeRef} className={styles.trackWrap}>
            <div ref={trackRef} className={styles.track}>
              {GROUPS.map((group, gi) => (
                <div
                  key={gi}
                  className={styles.group}
                  style={{ "--w": `${group.w}vh` }}
                >
                  {group.tiles.map((tile) => (
                    <figure
                      key={tile.src}
                      className={styles.tile}
                      style={{ "--h": tile.h }}
                    >
                      <Image
                        src={tile.src}
                        alt={tile.alt}
                        fill
                        sizes="(max-width: 900px) 70vw, 50vw"
                        className={styles.img}
                        // horizontal translation defeats native lazy loading
                        // (tiles sit at large x-offsets) — load up front
                        loading="eager"
                      />
                      <figcaption className={styles.cap}>{tile.cap}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}

              <div ref={ctaRef} className={styles.cta}>
                <Image
                  src="/images/decals/flower.png"
                  alt=""
                  width={180}
                  height={120}
                  className={styles.ctaOrnament}
                />
                <h3 className={styles.ctaHeading}>
                  Open for
                  <br />
                  <em>Bookings</em>
                </h3>
                <a
                  className={styles.ctaMail}
                  href={`mailto:${EMAIL}?subject=Booking%20enquiry%20—%20Nomadic`}
                >
                  {EMAIL}
                  <span className={styles.ctaMailArrow} aria-hidden="true">
                    →
                  </span>
                </a>
                <a className={styles.ctaGhost} href="#contact">
                  Or use the contact form
                </a>
              </div>
            </div>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span ref={progressRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
