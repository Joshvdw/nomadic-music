"use client";

import { useEffect, useRef, useState } from "react";
import { setChromePinned } from "@/lib/useScrollState";
import styles from "./Menu.module.css";

const ITEMS = [
  { id: "bio", label: "Bio" },
  { id: "streaming", label: "Streaming" },
  { id: "live", label: "Live" },
  { id: "gallery", label: "Gallery" },
  { id: "services", label: "Services" },
  { id: "collabs", label: "Collabs" },
  { id: "contact", label: "Contact" },
];

// Menu trigger + panel. The trigger is a cluster of four diamonds (echoing
// the ornament decals) that crossfades into an ✕ when open. Desktop gets a
// compact panel unfolding from the corner; phones get a fullscreen nav.
export default function Menu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const unpinTimer = useRef(null);

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

  // lock the page while open; Escape closes
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
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
    <div className={`${styles.menu} ${open ? styles.open : ""}`}>
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
              <li
                key={id}
                className={styles.item}
                style={{ "--i": i }}
              >
                <a
                  href={`#${id}`}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => go(e, id)}
                  tabIndex={open ? undefined : -1}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
