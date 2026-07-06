"use client";

import { useEffect, useRef, useState } from "react";
import useScrollState from "@/lib/useScrollState";
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
  const listRef = useRef(null);

  // Track which section is crossing the middle of the viewport.
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
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

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
      <ul ref={listRef} className={styles.list}>
        {ITEMS.map(({ id, label }) => {
          const isActive = active === id;
          const isCta = id === "contact";
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.link} ${isActive ? styles.active : ""} ${
                  isCta ? styles.cta : ""
                }`}
                aria-current={isActive ? "true" : undefined}
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
