import FooterMarquee from "@/components/FooterMarquee";
import styles from "./Bandcamp.module.css";

// "Buy the music" — the Bandcamp discography marquee as its own section,
// sitting between Services and Contact.
export default function Bandcamp() {
  return (
    <section
      id="bandcamp"
      className={styles.bandcamp}
      aria-label="Support my music on Bandcamp"
    >
      <header className={`${styles.header} container`} data-reveal>
        <p className="eyebrow">Support my music</p>
      </header>

      <div className="container">
        <FooterMarquee />
      </div>
    </section>
  );
}
