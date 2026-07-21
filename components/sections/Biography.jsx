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
        Math.min(
          1,
          (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2),
        ),
      );
      cur += (-p * 55 - cur) * 0.08;
      text.style.transform = `translate3d(0, ${cur.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="bio"
      ref={sectionRef}
      className={styles.bio}
      aria-label="Biography"
    >
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
            <h2 className={styles.heading}>The Tale So Far</h2>
            <p>
              Nomadic is the creative expression of Josh Waay, an electronic
              music artist originally from Amsterdam, who spent half his life in
              the alternative beach-town community of Golden Bay, New Zealand.
            </p>
            <p>
              A childhood of travel, an early love of music and the region's
              vibrant festival scene set the initial stage for his artistic
              development. As a teen he played guitar in several bands, before
              discovering a deep passion for electronic music and DJ culture. He
              began crafting his own dance tunes and performing live at local
              festivals, where the positive response drove him back to Amsterdam
              to properly study music production. This is where Nomadic was born
              and took shape over many years of refining his own unique approach
              and process.
            </p>
            <p>
              He's best known for fusing world music with bass-heavy beats,
              though his sound continues to evolve, refusing to be confined by
              any one genre. His songs invite listeners on a surreal journey,
              blending traditional live instruments with contemporary sound
              design, to create music that feels organic, mystical and
              otherworldly. He draws inspiration from the surrounding
              landscapes, ancient tribal cultures, and the introspective
              psychedelic experiences he's had in his life. His philosophy is to
              keep experimenting, breaking free from established tropes and
              template sounds, always aiming to make something fresh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
