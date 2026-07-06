import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      <p>© 2026 Nomadic Music</p>
      <p>
        Created by{" "}
        <a
          className={styles.credit}
          href="https://waay.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Waay Studio
        </a>
      </p>
    </footer>
  );
}
