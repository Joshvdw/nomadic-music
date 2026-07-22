import FooterMarquee from "./FooterMarquee";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      {/* <FooterMarquee /> */}
      <div className={styles.inner}>
        <p>© 2026 Nomadic Music</p>
        <p>Created by Waay Studio</p>
      </div>
    </footer>
  );
}
