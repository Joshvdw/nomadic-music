"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorDot.module.css";

// Small gold dot trailing the pointer; grows over links and images.
// Only mounts behaviour on fine pointers (no touch devices).
export default function CursorDot() {
  const dotRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const dot = dotRef.current;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let scale = 1;
    let tScale = 1;
    let visible = false;
    let rafId;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        dot.style.opacity = "1";
      }
      const hot = e.target.closest?.(
        "a, button, img, [role='button'], label, input, select, textarea"
      );
      tScale = hot ? 2 : 1;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      scale += (tScale - scale) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={dotRef} className={styles.dot} aria-hidden="true" />;
}
