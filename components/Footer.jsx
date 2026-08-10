import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      {/* no scroll reveal here: this strip only ever sits in the bottom slice
          of the viewport, which the reveal observer's negative bottom margin
          excludes — it would never fire */}
      <div className={styles.inner}>
        <p>© 2026 Nomadic Music</p>
        <p>Created by Waay Studio</p>
      </div>
    </footer>
  );
}
