# Nomadic — Official EPK

Artist site for **Nomadic** (Josh Waay), built with Next.js (App Router, JavaScript, CSS Modules). Spec lives in `initial-development-instructions.md`; Figma exports in
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