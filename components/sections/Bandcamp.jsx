import LazyEmbed from "@/components/LazyEmbed";
import styles from "./Bandcamp.module.css";

// "Buy my music" marquee — two auto-sliding strips of Bandcamp players
// drifting in opposite directions, bleeding past the page margins. One album
// repeated for now; swap in the full discography's embed URLs later.
const EMBED_SRC =
  "https://bandcamp.com/EmbeddedPlayer/album=3260472955/size=large/bgcol=ffffff/linkcol=333333/minimal=true/transparent=true/";

const TILES_PER_STRIP = 8;

function MarqueeRow({ reverse = false }) {
  return (
    <div className={styles.marquee}>
      <div className={`${styles.track} ${reverse ? styles.trackReverse : ""}`}>
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
                  height={220}
                  radius={4}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Bandcamp() {
  return (
    <section className={styles.bandcamp} aria-label="Buy the music on Bandcamp">
      <header className={`${styles.header} container`} data-reveal>
        <p className="eyebrow">On Bandcamp</p>
        <h2 className={styles.heading}>Buy My Music</h2>
      </header>

      <div className={styles.rows} data-reveal>
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
