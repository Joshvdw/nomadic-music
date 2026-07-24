// Twitter card reuses the Open Graph image (hero scene + Nomadic title block).
// Segment-config values are declared locally — Turbopack can't statically parse
// them when re-exported — while the image handler itself comes from opengraph-image.
export { default } from "./opengraph-image";

export const runtime = "nodejs";
export const alt = "Nomadic — electronic music producer & DJ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
