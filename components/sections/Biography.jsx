import Image from "next/image";
import styles from "./Biography.module.css";

// Portrait exported with its gradient baked in at 2× the reference frame, so
// it renders as the section's full backdrop. Sizing is tied to the gutter so
// the shadow line left of the head tracks the left content-margin grid line
// at every viewport width (see --bio-align in the module CSS).
export default function Biography() {
  return (
    <section id="bio" className={styles.bio} aria-label="Biography">
      <div className={styles.imageWrap}>
        <Image
          src="/images/bio.png"
          alt="Joshua van der Waay — Nomadic — portrait in low warm light, hair tied up, patterned scarf"
          width={3024}
          height={1880}
          quality={100}
          sizes="(max-width: 900px) 100vw, 90vw"
          className={styles.image}
        />
      </div>

      <div className={`${styles.copy} container`}>
        <div className={styles.text} data-reveal>
          <h2 className={styles.heading}>Lorem Ipsum</h2>
          <p>
            &ldquo;Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque laudantium, totam rem aperiam,
            eaque ipsa quae ab illo inventore veritatis et quasi architecto
            beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
            voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
            magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora
            incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
            enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
          </p>
          <p>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit
            esse quam nihil molestiae consequatur, vel illum qui dolorem eum
            fugiat quo voluptas nulla pariatur?&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
