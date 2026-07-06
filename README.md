# Nomadic — Official EPK

Single-page, booking-focused artist site for **Nomadic** (Joshua van der Waay),
built with Next.js (App Router, JavaScript, CSS Modules — no Tailwind/TS by
design). Spec lives in `development-instructions.md`; Figma exports in
`references/`; source imagery in `assets/` (staged into `public/images/`).

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # static production build
npm start       # serve the production build
npm run lint    # eslint
node scripts/qa-shots.mjs <outDir> <WxH> [prefix]   # headless QA screenshots
```

## Dev-guide overlays

Red content-margin borders and faded 8-column grid lines are wired to a single
flag: `DEV_GUIDES` in `lib/site.js`. Set `true` while aligning against Figma,
`false` for production.

## Placeholders / TODO before launch

- **Copy** is lorem ipsum per the design references — real copy to come.
- **`public/videos/dj-video.mp4`** (Live section, 720p 16:9) was not in the
  provided assets; the section shows its poster image until it's added.
- **Bandcamp + Instagram URLs** in `lib/site.js` are guesses — confirm.
- **Bandcamp marquee** uses placeholder release tiles — swap in real
  discography art/links in `components/sections/Bandcamp.jsx`.
- **Site URL** assumed `https://nomadicofficial.music` (`lib/site.js`) for
  metadata/JSON-LD — update if the domain differs.
- **Contact form** composes a `mailto:` — wire a form backend if preferred.
