// ---------------------------------------------------------------------------
// Site-wide constants — single source of truth for contact details and links.
// ---------------------------------------------------------------------------

// Dev-guide overlays (red margin borders + faded 8-column grid lines).
// Flip to false for production. Single switch, per development-instructions §4.
export const DEV_GUIDES = false;

export const SITE_URL = "https://nomadicofficial.music";
export const EMAIL = "contact@nomadicofficial.music";

export const LINKS = {
  spotify: "https://open.spotify.com/artist/5Wphrm29N2BLcBqZOmRXN5",
  soundcloud: "https://soundcloud.com/nomadic_official",
  bandcamp: "https://nomadicmusic.bandcamp.com",
  instagram: "https://www.instagram.com/nomadic_music",
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
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1414341391&color=%231f1f1f&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false";

// Bandcamp discography — release/track IDs feed the footer marquee.
// `album` true → EmbeddedPlayer/album=…, else track=…
const bcSrc = (id, isAlbum) =>
  `https://bandcamp.com/EmbeddedPlayer/${isAlbum ? "album" : "track"}=${id}/size=large/bgcol=333333/linkcol=ffffff/minimal=true/transparent=true/`;

export const BANDCAMP_RELEASES = [
  { id: 3260472955, album: true, title: "Voice the Creator" },
  { id: 3519743798, album: true, title: "Mana Harvest" },
  { id: 3298942202, album: true, title: "Arugam Rise" },
  { id: 2796466766, album: false, title: "Ascend" },
  { id: 679432827, album: false, title: "Cosmic Swamp" },
  { id: 3007004052, album: false, title: "Ruigoord" },
  { id: 2645811006, album: false, title: "Sun" },
  { id: 1660100889, album: false, title: "Affirmation" },
  { id: 4044274614, album: false, title: "Antanta" },
  { id: 698724188, album: false, title: "Tora" },
  { id: 1174865266, album: false, title: "Emerald Pool" },
  { id: 1245914874, album: false, title: "Mantra" },
  { id: 2229813905, album: false, title: "Karma" },
  { id: 3646903455, album: false, title: "Guava" },
  { id: 2229630219, album: false, title: "Suena" },
  { id: 439707172, album: false, title: "Dahlia" },
  { id: 1545485019, album: false, title: "Tribes (Weka Tek Remix)" },
  { id: 97770224, album: true, title: "Ennui" },
  { id: 2487809535, album: true, title: "Wandering Ming" },
  { id: 1675362088, album: true, title: "Explorations" },
].map((r) => ({ ...r, src: bcSrc(r.id, r.album) }));
