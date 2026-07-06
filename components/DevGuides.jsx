import { DEV_GUIDES } from "@/lib/site";
import styles from "./DevGuides.module.css";

// Development alignment aids: bright red borders on the content margins and
// faded lines for the 8-column grid. Rendered only while DEV_GUIDES is true
// (lib/site.js) — flip that single flag off for production.
export default function DevGuides() {
  if (!DEV_GUIDES) return null;
  return (
    <div className={styles.guides} aria-hidden="true">
      <div className={styles.margins} />
      <div className={styles.columns}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}
