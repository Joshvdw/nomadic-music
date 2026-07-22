"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useEmail from "@/lib/useEmail";
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

// Bento columns: each group is 1–2 stacked tiles at their natural ratios
// (--ar), and `w` (vh) is precomputed so every column totals ~66vh tall —
// singles, stacked pairs, tall posters and the square shot all line up.
// Mix of portrait, landscape, square and poster keeps the rhythm varied.
const GROUPS = [
  {
    w: 99.0,
    tiles: [
      {
        src: `${G}/laundry-bar-dj-set.jpg`,
        ar: "3068 / 2046",
        cap: "Laundry Bar — DJ set",
        alt: "Nomadic DJing at Laundry Bar in purple light",
      },
    ],
  },
  {
    w: 35.3,
    tiles: [
      {
        src: `${G}/newtown-social-club.JPG`,
        ar: "750 / 870",
        cap: "Newtown Social Club",
        alt: "Nomadic performing at Newtown Social Club",
      },
      {
        src: `${G}/wellington-club-dj-set3.jpg`,
        ar: "2048 / 1363",
        cap: "Psychoactive Studios — DJ set",
        alt: "Crowd silhouetted under blue light at a Wellington club DJ set",
      },
    ],
  },
  {
    w: 43.9,
    tiles: [
      {
        src: `${G}/wellington-club-dj-set2.jpg`,
        ar: "1363 / 2048",
        cap: "Psychoactive Studios — DJ set",
        alt: "Nomadic DJing at a Wellington club under blue stage light",
      },
    ],
  },
  {
    w: 67.7,
    tiles: [
      {
        src: `${G}/relish-festival-2021.jpg`,
        ar: "3517 / 3428",
        cap: "Relish Festival 2021",
        alt: "Nomadic behind the decks at Relish Festival 2021",
      },
    ],
  },
  {
    w: 32.9,
    tiles: [
      {
        src: `${G}/relish-festival-poster.jpg`,
        ar: "1440 / 1800",
        cap: "Relish Festival — headliner",
        alt: "Relish Festival lineup poster",
      },
      {
        src: `${G}/roots-and-rhythms-poster.png`,
        ar: "2500 / 1768",
        cap: "Roots & Rhythms — Tākaka",
        alt: "Roots and Rhythms event poster",
      },
    ],
  },
  {
    w: 46.7,
    tiles: [
      {
        src: `${G}/wandering-mind-release-poster.jpg`,
        ar: "4961 / 7016",
        cap: "Wandering Mind — album release",
        alt: "Wandering Mind album release party poster",
      },
    ],
  },
  {
    w: 55.2,
    tiles: [
      {
        src: `${G}/luminate-2015-artist-page.jpg`,
        ar: "2832 / 1422",
        cap: "Luminate 2019 — artist page",
        alt: "Nomadic's artist page on the Luminate Festival 2015 website",
      },
      {
        src: `${G}/wellington-club-dj-set.jpg`,
        ar: "2048 / 1363",
        cap: "Psychoactive Studios — DJ set",
        alt: "Nomadic DJing at a Wellington club under blue light",
      },
    ],
  },
  {
    w: 47.2,
    tiles: [
      {
        src: `${G}/ezone-luminate-2015.jpg`,
        ar: "2048 / 1365",
        cap: "E-Zone — Luminate 2015",
        alt: "Nomadic DJing in the E-Zone at Luminate Festival 2015",
      },
      {
        src: `${G}/luminate-programme-mention.jpg`,
        ar: "1236 / 864",
        cap: "Luminate 2019 — programme mention",
        alt: "Luminate Festival programme featuring Nomadic",
      },
    ],
  },
  {
    w: 43.9,
    tiles: [
      {
        src: `${G}/wellington-club-dj-set4.jpg`,
        ar: "1363 / 2048",
        cap: "Psychoactive Studios — DJ set",
        alt: "Nomadic performing at a Wellington club under blue light",
      },
    ],
  },
  {
    w: 45.6,
    tiles: [
      {
        src: `${G}/badgernomics-laundry-poster.jpg`,
        ar: "3508 / 2480",
        cap: "Badgernomics — Laundry Bar",
        alt: "Badgernomics Presents event poster, Laundry Bar",
      },
      {
        src: `${G}/boogie-house-laundry-poster.jpg`,
        ar: "1920 / 1357",
        cap: "Boogie House — Laundry Bar",
        alt: "Boogie House event poster, Laundry Bar",
      },
    ],
  },
  {
    w: 22.8,
    tiles: [
      {
        src: `${G}/spirit-level-release-poster.jpg`,
        ar: "2480 / 3508",
        cap: "Spirit Level — release party",
        alt: "Spirit Level album release party poster",
      },
      {
        src: `${G}/roots-bar-rave-poster.jpg`,
        ar: "2480 / 3508",
        cap: "Roots Bar Rave",
        alt: "Roots Bar Rave event poster",
      },
    ],
  },
  {
    w: 46.7,
    tiles: [
      {
        src: `${G}/paddy-free-gig-opening.png`,
        ar: "2480 / 3508",
        cap: "Paddy Free — gig opening",
        alt: "Paddy Free gig poster, Nomadic opening at Laundry Bar",
      },
    ],
  },
];

function BookingsCta({ className, ctaRef }) {
  const email = useEmail();
  return (
    <div ref={ctaRef} className={className}>
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
        href={
          email
            ? `mailto:${email}?subject=Booking%20enquiry%20—%20Nomadic`
            : undefined
        }
      >
        {email || "Email for bookings"}
        <span className={styles.ctaMailArrow} aria-hidden="true">
          →
        </span>
      </a>
      <a className={styles.ctaGhost} href="#contact">
        Or use the contact form
      </a>
    </div>
  );
}

export default function Gallery() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const headRef = useRef(null);
  const ctaRef = useRef(null);
  const fadeRef = useRef(null);
  const hintRef = useRef(null);

  // mobile: fade the swipe hint out once the strip is actually swiped
  useEffect(() => {
    const wrap = fadeRef.current;
    const hint = hintRef.current;
    if (!wrap || !hint) return;
    const onScroll = () => {
      if (wrap.scrollLeft > 24) {
        hint.style.opacity = "0";
        wrap.removeEventListener("scroll", onScroll);
      }
    };
    wrap.addEventListener("scroll", onScroll, { passive: true });
    return () => wrap.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    );
    const pin = pinRef.current;
    const track = trackRef.current;
    const head = headRef.current;
    const cta = ctaRef.current;
    const fadeEls = fadeRef.current.querySelectorAll(`.${styles.group}`);
    let active = false;
    let rafId = null;

    // the socials sidebar stays away for the entire gallery run
    const suppressIO = new IntersectionObserver(
      (entries) => setChromeSuppressed(entries.some((e) => e.isIntersecting)),
      { threshold: 0 },
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

      track.style.transform = `translate3d(${Math.round(-p * ox)}px, 0, 0)`;

      // archive title: hidden until horizontal scroll starts
      const titleIn = Math.min(1, p * 14);

      // gallery fades out as the bookings CTA crosses in — and the CTA
      // fades in on exactly the mirrored curve
      const ctaLeft = cta.getBoundingClientRect().left;
      const vw = window.innerWidth;
      const fade = 1 - Math.max(0, Math.min(1, (vw - ctaLeft) / (vw * 0.62)));

      head.style.opacity = (titleIn * fade).toFixed(3);
      fadeEls.forEach((el) => (el.style.opacity = fade.toFixed(3)));
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
    <section
      id="gallery"
      className={styles.gallery}
      aria-label="Gallery — live archive"
    >
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

              <BookingsCta ctaRef={ctaRef} className={styles.cta} />
            </div>
          </div>

          <p ref={hintRef} className={styles.swipeHint} aria-hidden="true">
            Swipe
          </p>
        </div>
      </div>

      {/* on phones the bookings block is its own section below the strip */}
      <BookingsCta className={styles.ctaMobile} />
    </section>
  );
}
