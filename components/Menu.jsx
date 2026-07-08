"use client";

import { useEffect, useRef, useState } from "react";
import useScrollState, { setChromePinned } from "@/lib/useScrollState";
import { LINKS, EMAIL } from "@/lib/site";
import {
  SpotifyIcon,
  BandcampIcon,
  SoundCloudIcon,
  InstagramIcon,
  MailIcon,
} from "./Icons";
import styles from "./Menu.module.css";

const ITEMS = [
  { id: "top", label: "Home" },
  { id: "bio", label: "Bio" },
  { id: "streaming", label: "Streaming" },
  { id: "live", label: "Nomadic Live" },
  { id: "gallery", label: "Gallery" },
  { id: "services", label: "Services" },
  { id: "collabs", label: "Collaborations" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  { label: "Spotify", href: LINKS.spotify, Icon: SpotifyIcon },
  { label: "Bandcamp", href: LINKS.bandcamp, Icon: BandcampIcon },
  { label: "SoundCloud", href: LINKS.soundcloud, Icon: SoundCloudIcon },
  { label: "Instagram", href: LINKS.instagram, Icon: InstagramIcon },
  { label: "Email", href: `mailto:${EMAIL}`, Icon: MailIcon },
];

// Menu trigger + panel. Two hairlines fold into an ✕; the panel unfolds from
// the corner on desktop and goes fullscreen on phones (with a socials row).
// The trigger hides over the hero / gallery / footer, matching the sidebar.
export default function Menu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { atTop, atBottom, suppressed } = useScrollState();
  const rootRef = useRef(null);
  const unpinTimer = useRef(null);

  const chromeHidden = atTop || atBottom || suppressed;

  // a section reads as active once it fills most of the viewport
  useEffect(() => {
    const sections = ITEMS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // lock the page while open; Escape + outside-click close
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) lenis?.stop();
    else lenis?.start();

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e) => {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      lenis?.start();
    };
  }, [open]);

  useEffect(() => () => clearTimeout(unpinTimer.current), []);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    setChromePinned(true);
    clearTimeout(unpinTimer.current);
    const unpin = () => setChromePinned(false);
    const lenis = window.__lenis;
    if (id === "top") {
      lenis?.start();
      lenis ? lenis.scrollTo(0, { onComplete: unpin }) : window.scrollTo(0, 0);
      unpinTimer.current = setTimeout(unpin, 4000);
      return;
    }
    if (lenis) {
      lenis.start();
      lenis.scrollTo(`#${id}`, { onComplete: unpin });
      unpinTimer.current = setTimeout(unpin, 4000); // safety net
    } else {
      document.getElementById(id)?.scrollIntoView();
      unpinTimer.current = setTimeout(unpin, 200);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.menu} ${open ? styles.open : ""} ${
        chromeHidden && !open ? styles.chromeHidden : ""
      }`}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.glyph} aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <nav id="site-menu" className={styles.panel} aria-label="Section navigation">
        <ul className={styles.list}>
          {ITEMS.map(({ id, label }, i) => {
            const isActive = active === id;
            return (
              <li key={id} className={styles.item} style={{ "--i": i }}>
                <a
                  href={id === "top" ? "#" : `#${id}`}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => go(e, id)}
                  tabIndex={open ? undefined : -1}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <ul className={styles.socials}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                className={styles.social}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                tabIndex={open ? undefined : -1}
              >
                <Icon className={styles.socialIcon} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
