import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      <div className={styles.inner}>
        <p>© 2026 Nomadic Music</p>
        <p>
          Created by <span className={styles.credit}>Waay Studio</span>
        </p>
      </div>
    </footer>
  );
}
