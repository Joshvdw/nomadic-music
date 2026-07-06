// QA screenshot harness: headless Chrome at exact viewports.
// Usage: node qa-shots.mjs <outDir> <width>x<height> [labelPrefix]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

const [outDir, size, prefix = ""] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

// snap transitions to end states for deterministic captures
await page.addStyleTag({
  content: "*,*::before,*::after{transition-duration:0s!important;transition-delay:0s!important}",
});

const shots = [
  ["hero", 0],
  ["bio", "#bio"],
  ["streaming", "#streaming"],
  ["collabs", "#collabs"],
  ["cta", "section[aria-label='Collaboration enquiries']", -180],
  ["live", "#live"],
  ["gallery-start", "GALLERY", 0.08],
  ["gallery-mid", "GALLERY", 0.5],
  ["gallery-end", "GALLERY", 0.97],
  ["services", "#services"],
  ["contact", "#contact"],
  ["bandcamp", "BOTTOM"],
];

for (const [name, target, extra] of shots) {
  await page.evaluate(
    ({ target, extra }) => {
      window.__lenis?.stop();
      if (target === 0) window.scrollTo(0, 0);
      else if (target === "BOTTOM") window.scrollTo(0, document.body.scrollHeight);
      else if (target === "GALLERY") {
        const pin = document.getElementById("gallery").firstElementChild;
        const top = pin.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + (pin.offsetHeight - innerHeight) * extra);
      } else {
        const el = document.querySelector(target);
        const top = el.getBoundingClientRect().top + window.scrollY + (extra || 0);
        window.scrollTo(0, top);
      }
      window.dispatchEvent(new Event("scroll"));
    },
    { target, extra }
  );
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${outDir}/${prefix}${name}.png`, type: "png" });
}

await browser.close();
console.log("done");
