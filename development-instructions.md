# Nomadic — Development Instructions

Single-page, fully responsive artist website for **Nomadic** (Joshua van der Waay). This document is the source of truth for the build. Work through it top to bottom: scaffolding first, then global systems, then section by section.

---

## 0. Project Context

**Who Nomadic is**
The artist project of a Dutch-born, NZ-based independent electronic producer and DJ. Sound is mid-tempo psy-dub / techno / tribal hybrid — hypnotic, head-nodding, tribal percussion, dub delay and sub weight, techno grooves, psychedelic sound design. Reference points: Four Tet, Bonobo, Jon Hopkins. ~200K monthly Spotify listeners, 20K+ followers, 40+ track catalogue, all organic. Known for *Wandering Mind* (Jumpsuit Records) and collaborations with Ayla Nereo, Skysia and others. Self-releasing via the Nomadic Music label.

**Primary purpose — booking-focused EPK.** The main job is landing gigs by giving promoters and bookers evidence: draw, live footage, festival/venue history, sound. Streaming stats function as draw evidence. It must read as a serious, professional artist.

**Secondary purpose — service inquiries.** Sound Design, Mastering, Private Tutoring, Design & Web — positioned as "Also Available For".

**Audience**
1. Festival/event promoters and bookers in the underground outdoor bass, psy and downtempo scene (NZ/AU, Golden Bay and beyond) — assessing draw, live credibility, sound.
2. Potential clients for music-related services.

---

## 1. Locked Design Decisions

Do not deviate from these without checking first.

**Palette**
- Background: `#080705`
- Amber/gold accent: `#E6D7A6`
- Text: `#E5F0F4` (cool off-white) — locked. Use this value everywhere `--ink` appears, including its opacity variants.

**Typography**
- Display / headers: **EB Garamond**
- Body / labels: **IBM Plex Sans**

**Aesthetic**
Dark, cinematic, premium, minimalist, digital — combined elegantly with organic, warmth, boho, ornamental content, so that varied imagery reads as one cohesive set.

**CSS variables (from style guide)**
```css
:root {
  --bg: #080705;
  --bg-2: #121212;
  --bg-3: #1F1F1F;
  --ink: #E5F0F4;
  --ink-80: rgba(229, 240, 244, .8);
  --ink-60: rgba(229, 240, 244, .6);
  --ink-40: rgba(229, 240, 244, .4);
  --gold: #E6D7A6;
  --gold-60: rgba(230, 215, 166, .6);
  --gold-40: rgba(230, 215, 166, .4);
  --gold-20: rgba(230, 215, 166, .2);
  --gold-10: rgba(230, 215, 166, .1);
  --serif: "EB Garamond", Georgia, "Times New Roman", serif;
  --sans: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
  --radius: 4px;
}
```
Add any further variables needed throughout (spacing scale, fluid type steps, z-index layers) and keep them consistent.

---

## 2. Build Constraints & Guidelines

- Work **within the current folder** — do not create a new project folder. An `assets` folder is already provided.
- Use the provided assets for content; they are already optimised. You may reorganise where it follows best practice (e.g. moving assets into `public/` where appropriate).
- **Verify the build against each Figma screenshot, section by section** — check spacing, type and colour values against the design tokens.
  - Unless overridden by specific instructions for that section.
  - Some designs are rough around the edges and not pixel-perfect. Where that happens, use best judgement to align and stay consistent with the rest of the site.
- **SEO is a priority.** Build with semantic HTML, clean descriptive alt text, `robots.txt` and basic crawlability settings. Add other best practices as you go or as re-prompted.
- Use **lorem ipsum** as shown in the design references for now — real copy comes later.

---

## 3. Initial Setup & Scaffolding

Do this first, before building anything.

- Set up via `create-next-app` (latest). Use React / Next, optimised for later Vercel deployment.
- **Tailwind and TypeScript are probably not needed** for this project — skip unless you judge them best for this project type. State the call you make.
- Follow Next.js best practices to get the most from the framework; keep the project lean.
  - Add fonts as variables, imported via `next/font`.
  - Use `next/image` for images.
  - Use other useful Next.js features where they help.
- Add the CSS variables from the style guide, plus any others needed site-wide. Keep consistent.
- **Fluid scaling:** combine `rem` with `clamp()` for true fluid scaling throughout, e.g. `font-size: clamp(2rem, 1rem + 2.5vw, 4rem);`
  - Figma pixel sizes (design is at **1512px** screen width) — use as the baseline for a fluid system following modern best practice:
    - h1 — 72px
    - h2 — 48px
    - h3 — 32px
    - h4 — 24px
    - card-titles-large — 24px
    - card-titles-small — 20px
    - paragraph — 16px
    - paragraph-small — 14px
    - paragraph-tiny — 12px
  - Use the same fluid approach for other sizing — card widths, section spacing, etc.
- Set up **git**, `.gitignore`, and an initial commit.

---

## 4. Global / Site-Wide Systems

- **Lenis smooth scroll** across the site.
- **Animating grain overlay** across the whole site — cinematic / vintage feel. Implement in the most lightweight way possible.
- **Section sizing:** each main section is `100vh` on desktop, with consistent extra padding between sections. Some sections don't fit this neatly — where so, it's noted in that section's instructions.
- **Content width:** `clamp(2rem, 12.5vw, 10rem)` for desktop side margins. Most content sits within these margins except clearly full-screen/width sections.
  - Add a **bright red border** along this margin on both sides for alignment checking during development.
- **8-column grid** (hence the 12.5vw clamp) — adhere to it for spacing decisions.
  - E.g. two cards side by side take up 3 columns each (with a gap between), which with 12.5vw sides makes 8 columns total.
  - Add **faded column lines** for the 8-column grid for alignment checking during development.
- **Consistent gaps** across grids and flexbox (e.g. between cards). Default **1rem**, adjust in **0.25rem** increments up or down as needed.
- **Custom scrollbar:** gold colour, 4px border radius, consistent with the design aesthetic. Text-highlight colour should also make sense with the palette.
- **Cursor dot:** small, gold, subtle 8–12px dot following the mouse, scaling up slightly on hover over links or images. Slick and smooth. **Disable on touch devices.**
- **Default section reveal:** smooth fade with a very subtle slight slide in from the bottom as it scrolls into view. Some sections override this with their own interaction.
- **Iframe embeds (Spotify, SoundCloud, Bandcamp):** add performance optimisations such as lazy loading. **No pop-in** when users reach the section — load must trigger further up the page so each embed is ready.
- **Email links:** all design placeholders use `joshvdw@live.com` — change every instance to `contact@nomadicofficial.music`.

> **Dev-guide toggle (suggested):** the red margin borders, faded column lines, and grid overlays are development aids. Wire them to a single flag (env var or constant) so they can be switched off in one place for production rather than hunted down individually.

---

## 5. Section-by-Section Build

### Top Nav
- Slides off-screen to the top smoothly on scroll, slides back in once scrolling stops. Try first with a slight delay before it happens.
- Does not show when scrolled to the top of the viewport (or on initial load — that's the landing position).
- Like the reference, but **without 'Nomadic' on the left** — home needs no link on this site.
- Not full-width — centred, only as wide as needed to fit the nav links.
- Small gap allowed between the top of the viewport and the nav.
- Same border radius as the cards (4px).
- Very subtle drop shadow.
- **Magnetic pull:** on hover, a white dot fades in below and shifts slightly toward the cursor as it approaches — tactile, physical (awwwards-style). Once clicked, the dot and text become gold and un-interactable.
- Add the `--gold-20` border.
- Make the final **Contact** nav item a little more CTA-like — still subtle, must fit the rest of the site.

### Socials Sidebar
- Slides off the side of the screen on scroll — same timing and easing as the top nav.
- Low opacity unless hovered.
- Accent colour on hover, plus a pop-out text blip naming the platform.
- When scrolled all the way to the bottom of the viewport: blips slide out, opacity increases (not accent colour), links slightly grow and pop out.
- Moves closer to the right edge as screen width reduces, so it never covers page text content.

### Hero
- Slick load-in interaction.
- Hero image always covers full viewport height and width — always crisp and high resolution.
- Text block positioned bottom-left, at the edge of the left content margin, equal width from the bottom of the viewport. Paragraph max-width below the title matches the title width above it.
- Two layers provided for the hero asset: a background, and the ball with a transparent background. **Ignore the layer with the ball baked into the image.** The ball layer sits on top (always in the same place) with a subtle **floating animation** — slowly moves up and down a few pixels, different values each cycle, sometimes slight side-to-side, very smooth easing.
- Subtle **mouse-move parallax** on the hero background (not the ball layer): moving the mouse left shifts the background slightly in response, and so on for each direction. Make both background and ball layer a few pixels larger than the viewport for room to move (hide overflow). Very subtle, smooth easing.

### Biography
- Simple section, but image/text positioning matters.
  - Paragraph text touches the right-side content margin (still left-aligned). Paragraph width set by optimal `ch` for readable articles.
  - Text block sits lower down, accentuated, in line with the eyes.
  - Bio photo is exported with the linear gradient included, at 2× the reference size. Positioning stays as shown across all screen sizes — the shadow line on the left of the head runs exactly across the left page margin grid.

### Streaming
- Different animate-in here — faster motion, more attention-grabbing than the default.
- **Count-up animation** for stat numbers.
- Streaming text block slightly indented from the left with padding on larger screens; on tighter laptop screens it can tuck to the left margin more.
- Spotify embed:
  ```html
  <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/artist/5Wphrm29N2BLcBqZOmRXN5?utm_source=generator&theme=0&si=d1d43b072deb4840" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  ```
- Embed width matches the bio paragraph width above.
- When this section scrolls into view, smoothly increase the grain overlay to max opacity.

### Collab
- Title and decoration fade/slide in as usual. Cards below get a unique animation: each card slides and fades in one by one, left to right, smoothly — like https://www.ciridae.com/
- Spotify embeds (design has placeholders):
  - Skysia: `https://open.spotify.com/embed/track/0FD96wFt8ZybDUmXFc6Fse?utm_source=generator&theme=0&si=194f03f023794f97`
  - Ayla: `https://open.spotify.com/embed/track/4nPmXEZkVUIoptajnSD0V4?utm_source=generator&theme=0&si=34cc0958c9f2436d`
  - Yamenjo: `https://open.spotify.com/embed/track/20hgkLMcwD8vrNFWtGuIp9?utm_source=generator&theme=0&si=371b8da68c8143ca`
  - Scott: `https://open.spotify.com/embed/track/14tAB7o9gquDFheWxA8rNz?utm_source=generator&theme=0&si=5955439e5c7a472f`
- Collab cards get a hover animation; the entire card is clickable, directing to the relevant track:
  - Skysia: `https://open.spotify.com/track/0FD96wFt8ZybDUmXFc6Fse?si=db17d767d0e64609`
  - Ayla: `https://open.spotify.com/track/4nPmXEZkVUIoptajnSD0V4?si=06c3920b604c428a`
  - Yamenjo: `https://open.spotify.com/track/20hgkLMcwD8vrNFWtGuIp9?si=2d22eda8957f419c`
  - Scott: `https://open.spotify.com/track/3ZYUvI7qJNYFCQXnDXEueH?si=e3d694acf32542c6`
- Record cards need no link or interaction.
- Even spacings throughout — consider the columns.

### Collab CTA
- Remove lines around the email CTA button.
- Add a line to the left of the "vocalists" text to match the line to the right of "labels".
- Ignore styling. Ignore the little rectangle behind the decorative element (it's just hiding something behind it).
- Remove the unique styling on the word 'together'.
- CTA button can move up a bit to match the spacing above; tuck the bottom of the outer div in so top and bottom spacing match and the whole thing is narrower.
- Quicker, more movement-based scroll-into-view interaction here — different from the default fade.

### Live
- Use the reference code as well as the reference image; instructions below override them.
- **Parallax:** content in the DJ sets column moves up faster than the video on the left.
- Column guide: DJ sets is 2 columns wide, tucked right against the right content margin. Festivals and gigs spans the remaining space on the left.
- Section height can be a bit less tall than the reference. Video is 720p, 16:9 — can be a bit taller than that.
- Linear gradient on the bottom-left of the video (as in references). Linear gradient on the top of the section so both video and the lighter black of the DJ sets column fade in smoothly. Linear gradient fade between the video and the DJ sets column.
- SoundCloud embed:
  ```html
  <iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay; encrypted-media" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1414341391&color=%231f1f1f&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
  ```
- SoundCloud link: `https://soundcloud.com/nomadic_escape`

### Gallery
- **Horizontal scroll** section. Use the reference code primarily.
- Change the grid from the original to a tighter, evenly spaced, puzzled-together **Bento grid** — slick and modern, awwwards-calibre.
- Keep captions fading in on hover.
- As the bookings CTA scrolls across the screen, the gallery images, the gallery/archive title and all other UI elements for this section fade out in sync with scroll.
- The archive gallery title (top-left) is initially hidden, fades in once you start scrolling the gallery horizontally.
- Section background is the regular background colour.
- Remove the unique font effect on 'bookings' text.

### Music Services
- Cards like the reference, but wider — full content-margin width. Similar sizes to the record label cards earlier, same gap between.
- Change the enquire button arrows to point down instead.
- Section background is the regular background colour.

### Contact
- Change the email to the real one (`contact@nomadicofficial.music`), same width as the content above.
- Section background is the regular background colour.
- Less width on inputs so there's space on the right for social links to expand.
- AI links below the email as shown, but bigger, with the service text next to each — maybe a white border to make them more button-like. Lay out as a **2×2 grid**.

### Bandcamp
- No reference provided. Add a **marquee auto-slider** (extending beyond page boundaries) of the Bandcamp discography to purchase — a "buy my music" marquee below the contact section.

---

## 6. Suggested Additions & Things to Consider

Not in the original spec — worth weighing up.

**Booking is the primary job — make the ask unmissable.** The EPK exists to land gigs, but the structure leads with services-style CTAs (email, enquire). Consider a dedicated, persistent **"Book Nomadic"** action — e.g. the Contact nav item routing to a booking-specific mailto with a pre-filled subject, or a short booking enquiry path distinct from the general services enquiry. Right now a promoter and a mastering client hit the same funnel.

**A downloadable EPK / tech rider.** Promoters frequently want a one-pager or PDF they can circulate internally. A single "Download EPK" link (press shot, bio, stats, key links, contact) meaningfully raises booking conversion and costs little to produce.

**Structured data for SEO/AEO.** Given SEO is a priority, add `MusicGroup` / `Person` schema (JSON-LD) with name, genre, social profiles, and `sameAs` links to Spotify/SoundCloud/Bandcamp/socials. This is exactly the kind of markup that helps an artist surface correctly in search and AI answers, and it's cheap to add.

**Open Graph / Twitter card meta.** A single-page EPK gets shared in DMs and emails between promoters constantly. A strong OG image (hero or press shot) and proper meta tags control how those links preview — high impact for a booking tool.

**Reduced-motion pass.** This build is motion-heavy (parallax, floating ball, count-ups, card cascades, cursor dot, grain). Honour `prefers-reduced-motion` — disable or soften the non-essential motion. Protects accessibility and stops the site feeling broken for anyone with motion sensitivity.

**Real favicon / app icons + PWA basics.** Small polish that reinforces the "serious professional artist" read when the tab and bookmarks look considered.

**Analytics from day one.** Even lightweight (Vercel Analytics or Plausible) — knowing which sections promoters engage with, and whether they hit the booking CTA, is worth having from launch.

**Loading strategy for the hero.** The hero is the first impression and carries a large image plus the load-in interaction. Make sure the LCP image is prioritised and the animation doesn't block paint — a janky hero undercuts the premium feel immediately.

**Consider `next/font` for EB Garamond weight range.** EB Garamond is used for display at large sizes; make sure the weights you pull (and any italic) actually cover what the headers need, without shipping unused weights.

---

## 7. Build Order (suggested sequence)

1. Scaffolding, fonts, CSS variables, dev-guide overlays (grid/margin borders behind a flag)
2. Global systems — Lenis, grain overlay, cursor dot, custom scrollbar, section-reveal utility, reduced-motion baseline
3. Layout shell — nav, socials sidebar, section scaffolding at 100vh
4. Hero (get the first impression right early)
5. Content sections top to bottom — Biography → Streaming → Collab → Collab CTA → Live → Gallery → Music Services → Contact → Bandcamp
6. Embed loading/lazy strategy pass (no pop-in)
7. Motion tuning pass
8. Mobile responsiveness + reduced-motion pass
9. SEO pass — semantic structure audit, alt text, robots.txt, schema, OG meta
10. Performance + QA against Figma, section by section
11. Strip/flag dev overlays for production, final commit

---

*Reference sites cited in spec: https://www.ciridae.com/ (collab card cascade).*
