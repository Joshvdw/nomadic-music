"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Biography.module.css";

// Portrait exported with its gradient baked in at 2× the reference frame, so
// it renders as the section's full backdrop. Sizing is tied to the gutter so
// the shadow line left of the head tracks the left content-margin grid line
// at every viewport width (see --bio-align in the module CSS).
//
// The text block drifts gently against the scroll (centred when the section
// is centred in the viewport).
export default function Biography() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const section = sectionRef.current;
    const text = textRef.current;
    let rafId;
    let cur = 0;

    const loop = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 → section below viewport, +1 → above; 0 → centred
      const p = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2))
      );
      cur += (-p * 55 - cur) * 0.08;
      text.style.transform = `translate3d(0, ${cur.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="bio" ref={sectionRef} className={styles.bio} aria-label="Biography">
      <div className={styles.imageWrap} data-reveal="fade" data-reveal-late="">
        <Image
          src="/images/bio.png"
          alt="Joshua van der Waay — Nomadic — portrait in low warm light, hair tied up, patterned scarf"
          width={3024}
          height={1880}
          quality={90}
          sizes="(max-width: 900px) 100vw, 90vw"
          className={styles.image}
        />
      </div>

      <div className={`${styles.copy} container`}>
        {/* parallax lives on the wrapper so it doesn't fight the reveal
            transition on the text block's own transform */}
        <div ref={textRef} className={styles.parallax}>
          <div className={styles.text} data-reveal>
          <Image
            src="/images/decals/flower.png"
            alt=""
            width={180}
            height={120}
            className={styles.decal}
          />
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
      </div>
    </section>
  );
}
