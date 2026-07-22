"use client";

import { useState } from "react";
import Image from "next/image";
import { decodeEmail } from "@/lib/email";
import useEmail from "@/lib/useEmail";
import { CopyIcon } from "@/components/Icons";
import styles from "./CollabCta.module.css";

// Light interlude banner. Copy-to-clipboard email CTA; falls back to a
// mailto link if the clipboard API is unavailable. `compact` shrinks it to
// sit as a row inside the Collaborations section.
export default function CollabCta({ compact = false }) {
  const [copied, setCopied] = useState(false);
  const email = useEmail(); // shown only after mount, absent from SSR HTML

  const copy = async () => {
    const address = decodeEmail();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  };

  return (
    <section
      className={`${styles.wrap} ${compact ? styles.compact : ""}`}
      aria-label="Collaboration enquiries"
      data-reveal="wipe"
    >
      <div className={styles.banner}>
        <Image
          src="/images/decals/flowers-black.png"
          alt=""
          width={92}
          height={52}
          className={styles.decal}
        />
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.line} aria-hidden="true" />
            Vocalists, Instrumentalists, Producers, Labels
            <span className={styles.line} aria-hidden="true" />
          </p>
          <h2 className={styles.heading}>Want to collaborate with me?</h2>
        </div>
        <button type="button" className={styles.button} onClick={copy}>
          <span className={styles.email}>{email || "Get in touch"}</span>
          <span className={styles.hint}>
            <CopyIcon className={styles.copyIcon} />
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </button>
      </div>
    </section>
  );
}
