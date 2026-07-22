import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Social share card: the hero scene (obsidian sphere over the ranges) with the
// "Nomadic" title block laid over it — mirroring the site hero so a shared link
// reads as the wordmark, not just a landscape.
export const runtime = "nodejs";
export const alt = "Nomadic — electronic music producer & DJ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// EB Garamond (the site's serif) — fetched as raw font bytes for Satori. The
// no-browser fetch makes Google Fonts hand back a truetype file, which Satori
// can read (it can't use woff2 or system fonts).
async function loadFont(text) {
  const url = `https://fonts.googleapis.com/css2?family=EB+Garamond:wght@700&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!src) throw new Error("EB Garamond source not found");
  return (await fetch(src[1])).arrayBuffer();
}

export default async function OpengraphImage() {
  const bg = readFileSync(join(process.cwd(), "public/images/og.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

  const title = "Nomadic";
  const tagline =
    "A wandering producer and DJ from New Zealand, reimagining ancient sounds as otherworldly electronic music.";

  const garamond = await loadFont(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* bottom scrim so the title reads over the sky */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(8,7,5,0.92) 6%, rgba(8,7,5,0.45) 34%, rgba(8,7,5,0) 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "EB Garamond",
              fontWeight: 700,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#e6d7a6",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 22,
              maxWidth: 780,
              fontFamily: "EB Garamond",
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(229,240,244,0.82)",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "EB Garamond",
          data: garamond,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
