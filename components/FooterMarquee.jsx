import LazyEmbed from "./LazyEmbed";
import styles from "./FooterMarquee.module.css";

// Compact Bandcamp strip riding directly above the footer rule. Spans the
// content margins with black gradient wings so it fades into the distance
// on both sides. One album repeated for now — swap in the discography later.
const EMBED_SRC =
  "https://bandcamp.com/EmbeddedPlayer/album=3260472955/size=large/bgcol=ffffff/linkcol=333333/minimal=true/transparent=true/";

const TILES_PER_STRIP = 14;

export default function FooterMarquee() {
  return (
    <div className={styles.marquee} aria-label="Buy the music on Bandcamp">
      <div className={styles.track}>
        {[0, 1].map((copyIdx) => (
          <ul
            key={copyIdx}
            className={styles.strip}
            aria-hidden={copyIdx === 1 ? "true" : undefined}
          >
            {Array.from({ length: TILES_PER_STRIP }).map((_, i) => (
              <li key={i} className={styles.tile}>
                <LazyEmbed
                  src={EMBED_SRC}
                  title="Voice the Creator by Nomadic — Bandcamp player"
                  height={104}
                  radius={4}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
      <span className={styles.fadeLeft} aria-hidden="true" />
      <span className={styles.fadeRight} aria-hidden="true" />
    </div>
  );
}
