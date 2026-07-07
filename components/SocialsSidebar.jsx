"use client";

import useScrollState from "@/lib/useScrollState";
import { LINKS, EMAIL } from "@/lib/site";
import {
  SpotifyIcon,
  BandcampIcon,
  SoundCloudIcon,
  InstagramIcon,
  MailIcon,
} from "./Icons";
import styles from "./SocialsSidebar.module.css";

const SOCIALS = [
  { label: "Spotify", href: LINKS.spotify, Icon: SpotifyIcon },
  { label: "Bandcamp", href: LINKS.bandcamp, Icon: BandcampIcon },
  { label: "SoundCloud", href: LINKS.soundcloud, Icon: SoundCloudIcon },
  { label: "Instagram", href: LINKS.instagram, Icon: InstagramIcon },
  { label: "Email", href: `mailto:${EMAIL}`, Icon: MailIcon },
];

export default function SocialsSidebar() {
  const { atTop, atBottom, suppressed } = useScrollState();

  // Always on screen except over the hero, the gallery's pinned run, and
  // the footer zone at the very bottom — slides back in beyond those.
  const hidden = atTop || atBottom || suppressed;
  const cls = `${styles.sidebar} ${hidden ? styles.hidden : ""}`;

  return (
    <aside className={cls} aria-label="Nomadic on streaming platforms and social media">
      <ul className={styles.list}>
        {SOCIALS.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              className={styles.item}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon className={styles.icon} />
              <span className={styles.blip}>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
