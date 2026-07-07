"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { EMAIL } from "@/lib/site";
import { setChromeSuppressed } from "@/lib/useScrollState";
import styles from "./Gallery.module.css";

// Horizontal, scroll-driven archive. The viewport pins while vertical scroll
// translates a bento-grid track sideways, ending with the bookings CTA centred
// on screen. Falls back to native horizontal swipe on mobile / reduced motion.
//
// Bento: flex row of column groups; every tile keeps its image's natural
// aspect ratio (--ar), and each group's width (--w, in vh) is derived from
// those ratios so stacked pairs sum to the 66vh column — nothing gets cropped.

const G = "/images/gallery";

const DEPTHS = [1.12, 0.88, 1.16, 0.85, 1.1, 0.9, 1.14, 0.86, 1.08, 0.92];

const GROUPS = [
  {
    w: 43.9,
    tiles: [
      { src: `${G}/relish-festival-live-1.jpg`, ar: "1363 / 2048", cap: "Relish Festival — live", alt: "Nomadic performing at Relish Festival, hands raised over the decks" },
    ],
  },
  {
    w: 48.3,
    tiles: [
      { src: `${G}/laundry-bar-dj.jpg`, ar: "3068 / 2046", cap: "Laundry Bar", alt: "Nomadic DJing at Laundry Bar in warm light" },
      { src: `${G}/roots-bar-decks.jpg`, ar: "2048 / 1367", cap: "Roots Bar — Tākaka", alt: "Back-to-back DJ set at Roots Bar, Tākaka" },
    ],
  },
  {
    w: 30.4,
    tiles: [
      { src: `${G}/roots-and-rhythms-poster.png`, ar: "2500 / 1768", cap: "Roots & Rhythms — Tākaka", alt: "Roots and Rhythms event poster" },
      { src: `${G}/roots-bar-rave-poster.jpg`, ar: "2480 / 3508", cap: "Roots Bar Rave", alt: "Roots Bar Rave event poster" },
    ],
  },
  {
    w: 99.1,
    tiles: [
      { src: `${G}/luminate-chillounge-dj.jpg`, ar: "4502 / 2997", cap: "Chillounge — Luminate Festival", alt: "Nomadic DJing the Chillounge stage at Luminate Festival" },
    ],
  },
  {
    w: 33,
    tiles: [
      { src: `${G}/luminate-programme.jpg`, ar: "1236 / 864", cap: "Luminate — programme", alt: "Luminate Festival programme booklet featuring Nomadic" },
      { src: `${G}/relish-festival-poster.jpg`, ar: "1440 / 1800", cap: "Relish Festival — lineup", alt: "Relish Festival lineup poster" },
    ],
  },
  {
    w: 43.6,
    tiles: [
      { src: `${G}/festival-stage.jpg`, ar: "2655 / 2046", cap: "In the field", alt: "Festival stage and crowd at dusk" },
      { src: `${G}/badgernomics-poster.jpg`, ar: "3508 / 2480", cap: "Badgernomics — Laundry Bar", alt: "Badgernomics Presents event poster" },
    ],
  },
  {
    w: 46.7,
    tiles: [
      { src: `${G}/wandering-mind-release-poster.jpg`, ar: "4961 / 7016", cap: "Wandering Mind — album release", alt: "Wandering Mind album release party poster" },
    ],
  },
  {
    w: 53.3,
    tiles: [
      { src: `${G}/boogie-house-poster.jpg`, ar: "1920 / 1357", cap: "Boogie House — Laundry Bar", alt: "Boogie House event poster" },
      { src: `${G}/luminate-artist-page.jpg`, ar: "2832 / 1422", cap: "Luminate — artist page", alt: "Nomadic's artist page on the Luminate Festival website" },
    ],
  },
  {
    w: 46.7,
    tiles: [
      { src: `${G}/spirit-level-release-poster.jpg`, ar: "2480 / 3508", cap: "Spirit Level — release party", alt: "Spirit Level album release party poster" },
    ],
  },
  {
    w: 31,
    tiles: [
      { src: `${G}/double-bill-poster.png`, ar: "2480 / 3508", cap: "Double bill — Laundry Bar", alt: "Double-bill event poster, Laundry Bar" },
      { src: `${G}/relish-festival-live-2.jpg`, ar: "2048 / 1363", cap: "Relish Festival — after dark", alt: "Nomadic behind the decks at Relish Festival at night" },
    ],
  },
];

export default function Gallery() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const ctaRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
    );
    const pin = pinRef.current;
    const track = trackRef.current;
    const head = headRef.current;
    const cta = ctaRef.current;
    const fadeEls = fadeRef.current.querySelectorAll(`.${styles.group}`);
    // per-tile depths: singles take the group depth; stacked pairs split it,
    // the bottom tile mirroring the top so they drift at different timings
    const tileEls = [];
    fadeEls.forEach((group, gi) => {
      const tiles = group.querySelectorAll(`.${styles.tile}`);
      tiles.forEach((tile, ti) => {
        const d = DEPTHS[gi % DEPTHS.length];
        tileEls.push({ el: tile, depth: ti === 0 ? d : 2 - d });
      });
    });
    let active = false;
    let rafId = null;

    // the socials sidebar stays away for the entire gallery run
    const suppressIO = new IntersectionObserver(
      (entries) => setChromeSuppressed(entries.some((e) => e.isIntersecting)),
      { threshold: 0 }
    );
    suppressIO.observe(pin);

    // horizontal distance: ends with the CTA centred on screen
    const overflow = () =>
      Math.max(0, cta.offsetLeft + cta.offsetWidth / 2 - window.innerWidth / 2);

    const measure = () => {
      if (!desktop.matches) {
        active = false;
        pin.style.height = "";
        track.style.transform = "";
        head.style.opacity = "";
        cta.style.opacity = "";
        fadeEls.forEach((el) => (el.style.opacity = ""));
        tileEls.forEach(({ el }) => (el.style.transform = ""));
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

      // gallery fades out as the bookings CTA crosses in — and the CTA
      // fades in on exactly the mirrored curve
      const ctaLeft = cta.getBoundingClientRect().left;
      const vw = window.innerWidth;
      const fade =
        1 - Math.max(0, Math.min(1, (vw - ctaLeft) / (vw * 0.62)));

      head.style.opacity = (titleIn * fade).toFixed(3);
      fadeEls.forEach((el) => (el.style.opacity = fade.toFixed(3)));
      tileEls.forEach(({ el, depth }) => {
        el.style.transform = `translate3d(${((1 - depth) * p * 1000).toFixed(1)}px, 0, 0)`;
      });
      cta.style.opacity = (1 - fade).toFixed(3);
    };

    const onScroll = () => {
      if (active && rafId === null) rafId = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    const t = setTimeout(measure, 500);

    return () => {
      clearTimeout(t);
      if (rafId !== null) cancelAnimationFrame(rafId);
      suppressIO.disconnect();
      setChromeSuppressed(false);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section id="gallery" className={styles.gallery} aria-label="Gallery — live archive">
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.viewport}>
          <header ref={headRef} className={styles.head}>
            <span className="eyebrow">
              <span className={styles.headLine} aria-hidden="true" />
              Archive
            </span>
            <h2 className={styles.heading}>Gallery</h2>
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
                      style={{ "--ar": tile.ar }}
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
                  Bookings
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
        </div>
      </div>
    </section>
  );
}
