// ---------------------------------------------------------------------------
// Site-wide constants — single source of truth for contact details and links.
// ---------------------------------------------------------------------------

// Dev-guide overlays (red margin borders + faded 8-column grid lines).
// Flip to false for production. Single switch, per development-instructions §4.
export const DEV_GUIDES = true;

export const SITE_URL = "https://nomadicofficial.music";
export const EMAIL = "contact@nomadicofficial.music";

export const LINKS = {
  spotify: "https://open.spotify.com/artist/5Wphrm29N2BLcBqZOmRXN5",
  soundcloud: "https://soundcloud.com/nomadic_escape",
  bandcamp: "https://nomadicmusic.bandcamp.com", // TODO: confirm real Bandcamp URL
  instagram: "https://www.instagram.com/nomadic.music.nz", // TODO: confirm real Instagram URL
};

export const TRACKS = {
  skysia: {
    embed:
      "https://open.spotify.com/embed/track/0FD96wFt8ZybDUmXFc6Fse?utm_source=generator&theme=0&si=194f03f023794f97",
    link: "https://open.spotify.com/track/0FD96wFt8ZybDUmXFc6Fse?si=db17d767d0e64609",
  },
  ayla: {
    embed:
      "https://open.spotify.com/embed/track/4nPmXEZkVUIoptajnSD0V4?utm_source=generator&theme=0&si=34cc0958c9f2436d",
    link: "https://open.spotify.com/track/4nPmXEZkVUIoptajnSD0V4?si=06c3920b604c428a",
  },
  yamenjo: {
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
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1414341391&color=%231f1f1f&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true";
