"use client";

import { useEffect, useRef, useState } from "react";

// Third-party iframe (Spotify / SoundCloud / Bandcamp) that starts loading
// well before its section reaches the viewport — rootMargin extends ~1.5
// screens down the page so the player is ready on arrival (no pop-in).
// Height is reserved up front; a shimmer covers the load.
export default function LazyEmbed({
  src,
  title,
  height,
  radius = 12,
  allow,
  rootMargin = "150% 0px 150% 0px",
}) {
  const shellRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={shellRef}
      className="embed-shell"
      data-loaded={loaded}
      style={{ height, borderRadius: radius }}
    >
      {armed && (
        <iframe
          src={src}
          title={title}
          height={height}
          loading="lazy"
          allow={
            allow ??
            "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          }
          style={{ borderRadius: radius, height: "100%" }}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
