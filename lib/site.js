// ---------------------------------------------------------------------------
// Site-wide constants — single source of truth for contact details and links.
// ---------------------------------------------------------------------------

// Dev-guide overlays (red margin borders + faded 8-column grid lines).
// Flip to false for production. Single switch, per development-instructions §4.
export const DEV_GUIDES = false;

export const SITE_URL = "https://nomadicmusic.live";
// The contact address is intentionally NOT stored here in plaintext — see
// lib/email.js (base64-encoded) so it never lands in the client bundle.

export const LINKS = {
  spotify: "https://open.spotify.com/artist/5Wphrm29N2BLcBqZOmRXN5",
  soundcloud: "https://soundcloud.com/nomadic_official",
  bandcamp: "https://nomadicmusic.bandcamp.com",
  instagram: "https://www.instagram.com/nomadic_music",
};

export const TRACKS = {
  skysia: {
    embed:
      "https://open.spotify.com/embed/track/5NyYRPtiVj82VPdaZLPECx?utm_source=generator&theme=0&si=49ccdebc294244b8",
    link: "https://open.spotify.com/track/5NyYRPtiVj82VPdaZLPECx",
  },
  ayla: {
    embed:
      "https://open.spotify.com/embed/track/4nPmXEZkVUIoptajnSD0V4?utm_source=generator&theme=0&si=34cc0958c9f2436d",
    link: "https://open.spotify.com/track/4nPmXEZkVUIoptajnSD0V4?si=06c3920b604c428a",
  },
  yemanjo: {
    embed:
      "https://open.spotify.com/embed/track/20hgkLMcwD8vrNFWtGuIp9?utm_source=generator&theme=0&si=371b8da68c8143ca",
    link: "https://open.spotify.com/track/20hgkLMcwD8vrNFWtGuIp9?si=2d22eda8957f419c",
  },
  scott: {
    embed:
      "https://open.spotify.com/embed/track/14tAB7o9gquDFheWxA8rNz?utm_source=generator&theme=0&si=5955439e5c7a472f",
    link: "https://open.spotify.com/track/3ZYUvI7qJNYFCQXnDXEueH?si=e3d694acf32542c6",
  },
};

export const SPOTIFY_ARTIST_EMBED =
  "https://open.spotify.com/embed/artist/5Wphrm29N2BLcBqZOmRXN5?utm_source=generator&theme=0&si=d1d43b072deb4840";

export const SOUNDCLOUD_PLAYLIST_EMBED =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1414341391&color=%231f1f1f&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false";
