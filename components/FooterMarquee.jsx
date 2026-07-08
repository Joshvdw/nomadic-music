import LazyEmbed from "./LazyEmbed";
import { BANDCAMP_RELEASES, LINKS } from "@/lib/site";
import { ArrowRightIcon } from "./Icons";
import styles from "./FooterMarquee.module.css";

// Bandcamp strip riding above the footer rule. Spans the content margins with
// black gradient wings so it fades into the distance on both sides. Players
// arm ~2 screens early so they're ready by the time the footer scrolls in.
export default function FooterMarquee() {
  return (
    <div className={styles.wrap}>
      <a
        className={styles.header}
        href={LINKS.bandcamp}
        target="_blank"
        rel="noopener noreferrer"
      >
        Support My Music
        <ArrowRightIcon className={styles.arrow} />
      </a>

      <div className={styles.marquee} aria-label="Buy the music on Bandcamp">
        <div className={styles.track}>
          {[0, 1].map((copyIdx) => (
            <ul
              key={copyIdx}
              className={styles.strip}
              aria-hidden={copyIdx === 1 ? "true" : undefined}
            >
              {BANDCAMP_RELEASES.map((r) => (
                <li key={`${copyIdx}-${r.id}`} className={styles.tile}>
                  <LazyEmbed
                    src={r.src}
                    title={`${r.title} by Nomadic — Bandcamp player`}
                    height={140}
                    radius={4}
                    rootMargin="200% 0px 200% 0px"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
        <span className={styles.fadeLeft} aria-hidden="true" />
        <span className={styles.fadeRight} aria-hidden="true" />
      </div>
    </div>
  );
}
