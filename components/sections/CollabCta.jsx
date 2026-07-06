"use client";

import { useState } from "react";
import Image from "next/image";
import { EMAIL } from "@/lib/site";
import { CopyIcon } from "@/components/Icons";
import styles from "./CollabCta.module.css";

// Light interlude banner. Copy-to-clipboard email CTA; falls back to a
// mailto link if the clipboard API is unavailable.
export default function CollabCta() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      className={`${styles.wrap} container`}
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
        <p className={styles.eyebrow}>
          <span className={styles.line} aria-hidden="true" />
          Vocalists, Instrumentalists, Producers, Labels
          <span className={styles.line} aria-hidden="true" />
        </p>
        <h2 className={styles.heading}>Let&rsquo;s make something together</h2>
        <p className={styles.blurb}>
          Nomadic is open to remixes, features and original collaborations with
          artists working in adjacent territory. One email is all it takes.
        </p>
        <button type="button" className={styles.button} onClick={copy}>
          <span className={styles.email}>{EMAIL}</span>
          <span className={styles.hint}>
            <CopyIcon className={styles.copyIcon} />
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </button>
      </div>
    </section>
  );
}
