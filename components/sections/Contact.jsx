"use client";

import { useEffect, useState } from "react";
import { EMAIL, LINKS } from "@/lib/site";
import Footer from "@/components/Footer";
import {
  SpotifyIcon,
  BandcampIcon,
  SoundCloudIcon,
  InstagramIcon,
  CopyIcon,
} from "@/components/Icons";
import styles from "./Contact.module.css";

const SUBJECTS = [
  "Booking",
  "Collaboration",
  "Sound Design",
  "Mastering",
  "Private Tutoring",
  "Design & Web",
  "Other",
];

const PLATFORMS = [
  { label: "Spotify", href: LINKS.spotify, Icon: SpotifyIcon },
  { label: "Bandcamp", href: LINKS.bandcamp, Icon: BandcampIcon },
  { label: "SoundCloud", href: LINKS.soundcloud, Icon: SoundCloudIcon },
  { label: "Instagram", href: LINKS.instagram, Icon: InstagramIcon },
];

export default function Contact() {
  const [subject, setSubject] = useState("Booking");
  const [copied, setCopied] = useState(false);

  // "Enquire" buttons in Services pre-select the matching subject.
  useEffect(() => {
    const onEnquire = (e) => {
      setSubject(SUBJECTS.includes(e.detail) ? e.detail : "Other");
    };
    window.addEventListener("nomadic:enquire", onEnquire);
    return () => window.removeEventListener("nomadic:enquire", onEnquire);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  // No backend: compose the message into the visitor's mail client.
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const from = data.get("email");
    const message = data.get("message");
    const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `${subject} enquiry — Nomadic`
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className={styles.contact} aria-label="Contact">
      <div className={`${styles.columns} container`}>
        <div className={styles.info} data-reveal>
          <div className={styles.infoBlock}>
            <h2 className={styles.heading}>Get in Touch</h2>
            <p className={styles.blurb}>
              Bookings, collaborations and services. Based in Golden Bay,
              playing anywhere the music is welcome — expect a reply within a
              couple of days.
            </p>
          </div>

        </div>

        <button type="button" className={styles.emailBox} onClick={copy}>
          <span className={styles.email}>{EMAIL}</span>
          <span className={styles.copyLabel}>
            <CopyIcon className={styles.copyIcon} />
            {copied ? "Copied" : "Copy"}
          </span>
        </button>

        <ul className={styles.platforms}>
          {PLATFORMS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                className={styles.platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className={styles.platformIcon} />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <form className={styles.form} onSubmit={onSubmit} data-reveal>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input className={styles.input} type="text" name="name" required autoComplete="name" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input className={styles.input} type="email" name="email" required autoComplete="email" />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Subject</span>
            <select
              className={styles.input}
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Message</span>
            <textarea className={styles.input} name="message" rows={6} required />
          </label>

          <button className={styles.submit} type="submit">
            Send Message
          </button>
        </form>
      </div>

      {/* pinned to the bottom of the viewport frame; the contact block above
          centres itself in the full viewport regardless */}
      <div className={styles.footerSlot}>
        <Footer />
      </div>
    </section>
  );
}
