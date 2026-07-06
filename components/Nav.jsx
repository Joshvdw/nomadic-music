"use client";

import { useEffect, useRef, useState } from "react";
import useScrollState, { setChromePinned } from "@/lib/useScrollState";
import styles from "./Nav.module.css";

const ITEMS = [
  { id: "bio", label: "Bio" },
  { id: "streaming", label: "Streaming" },
  { id: "collabs", label: "Collabs" },
  { id: "live", label: "Live" },
  { id: "gallery", label: "Gallery" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const { scrolling, atTop } = useScrollState();
  const [active, setActive] = useState(null);
  const unpinTimer = useRef(null);

  // A section reads as active only once it fills most of the viewport —
  // its box has to reach the band ~30% from the top.
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

  useEffect(() => () => clearTimeout(unpinTimer.current), []);

  // Keep the nav + socials sidebar on screen while a nav-triggered scroll is
  // in flight; normal hide-on-scroll behaviour resumes on arrival.
  const onNavClick = (e, id) => {
    e.preventDefault();
    setChromePinned(true);
    clearTimeout(unpinTimer.current);
    const unpin = () => setChromePinned(false);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, { onComplete: unpin });
      unpinTimer.current = setTimeout(unpin, 4000); // safety net
    } else {
      document.getElementById(id)?.scrollIntoView();
      unpinTimer.current = setTimeout(unpin, 200);
    }
  };

  // Magnetic dot: shifts toward the cursor as it moves across a link.
  const onLinkMove = (e) => {
    const link = e.currentTarget;
    const rect = link.getBoundingClientRect();
    const offset = e.clientX - (rect.left + rect.width / 2);
    link.style.setProperty("--pull", `${Math.max(-9, Math.min(9, offset * 0.25))}px`);
  };

  const onLinkLeave = (e) => {
    e.currentTarget.style.setProperty("--pull", "0px");
  };

  const hidden = atTop || scrolling;

  return (
    <nav
      className={`${styles.nav} ${hidden ? styles.hidden : ""}`}
      aria-label="Section navigation"
    >
      <ul className={styles.list}>
        {ITEMS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => onNavClick(e, id)}
                onPointerMove={onLinkMove}
                onPointerLeave={onLinkLeave}
              >
                {label}
                <span className={styles.dot} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
