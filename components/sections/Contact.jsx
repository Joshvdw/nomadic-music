"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import contactImg from "@/public/images/contact-old.jpg";
import { LINKS } from "@/lib/site";
import { decodeEmail } from "@/lib/email";
import useEmail from "@/lib/useEmail";
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

// Public Web3Forms access key — safe to expose (used from the browser). The
// destination address lives in the Web3Forms dashboard, not in this code.
const WEB3FORMS_ACCESS_KEY = "35390068-ae78-4076-a8a7-368b8d5b9c96";

export default function Contact() {
  const [subject, setSubject] = useState("Booking");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const email = useEmail(); // address for the copy button, revealed post-mount

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
      await navigator.clipboard.writeText(decodeEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  // Submits through Web3Forms — the destination address lives in their
  // dashboard (behind the access key), never in the client or the HTML.
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: "Nomadic website",
          subject: `${subject} enquiry — Nomadic`,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck") ? true : false, // honeypot
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!json.success) {
        throw new Error(json.message || "Couldn't send — please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't send — please try again.");
    }
  };

  return (
    <section id="contact" className={styles.contact} aria-label="Contact">
      <div className={`${styles.columns} container`}>
        {/* left column grouped so the form (right) doesn't stretch the gaps
            between these on desktop; on phones .infoCol is display:contents so
            the grid can still interleave form between info and the links */}
        <div className={styles.infoCol}>
          <div className={styles.info} data-reveal>
            <div className={styles.infoBlock}>
              <h2 className={styles.heading}>Get in Touch</h2>
              <p className={styles.blurb}>
                I&rsquo;d love to hear from you, send me a message and
                I&rsquo;ll get back to you as soon as I can.
              </p>
            </div>
            <Image src={contactImg} alt="" className={styles.contactImg} />
          </div>

          <button
            type="button"
            className={styles.emailBox}
            onClick={copy}
            disabled={!email}
          >
            <span className={styles.email}>{email || "Email me directly"}</span>
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
        </div>

        <form className={styles.form} onSubmit={onSubmit} data-reveal>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                required
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                required
                autoComplete="email"
              />
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
            <textarea
              className={styles.input}
              name="message"
              rows={6}
              required
            />
          </label>

          {/* honeypot — Web3Forms drops submissions where this is checked */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ display: "none" }}
          />

          <button
            className={styles.submit}
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Message sent ✓"
                : "Send Message"}
          </button>

          {status === "sent" && (
            <p className={styles.formNote} role="status">
              Thanks — I&rsquo;ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className={styles.formNote} role="alert">
              {error}
            </p>
          )}
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
