import { LINKS } from "@/lib/site";
import { BandcampIcon, ArrowRightIcon } from "@/components/Icons";
import styles from "./Bandcamp.module.css";

// "Buy the music" marquee — an auto-sliding strip of the Bandcamp
// discography, bleeding past the page margins. Album art/titles are
// placeholders until the real discography data lands.
const RELEASES = [
  { title: "Wandering Mind", year: "2023" },
  { title: "Lorem Ipsum", year: "2022" },
  { title: "Dolor Sit Amet", year: "2022" },
  { title: "Consectetur", year: "2021" },
  { title: "Tempor Incididunt", year: "2021" },
  { title: "Magna Aliqua", year: "2020" },
  { title: "Ut Enim Minima", year: "2019" },
];

export default function Bandcamp() {
  return (
    <section className={styles.bandcamp} aria-label="Buy the music on Bandcamp">
      <header className={`${styles.header} container`} data-reveal>
        <p className="eyebrow">Buy the Music</p>
        <h2 className={styles.heading}>On Bandcamp</h2>
      </header>

      <div className={styles.marquee} data-reveal>
        <div className={styles.track}>
          {[0, 1].map((copyIdx) => (
            <ul
              key={copyIdx}
              className={styles.strip}
              aria-hidden={copyIdx === 1 ? "true" : undefined}
            >
              {RELEASES.map(({ title, year }) => (
                <li key={`${copyIdx}-${title}`}>
                  <a
                    className={styles.release}
                    href={LINKS.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copyIdx === 1 ? -1 : undefined}
                  >
                    <span className={styles.cover}>
                      <BandcampIcon className={styles.coverIcon} />
                    </span>
                    <span className={styles.meta}>
                      <span className={styles.title}>{title}</span>
                      <span className={styles.year}>{year}</span>
                    </span>
                    <span className={styles.buy}>
                      Buy
                      <ArrowRightIcon className={styles.buyArrow} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
