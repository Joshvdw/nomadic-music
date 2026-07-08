import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const p = await b.newPage();
// 320px: measure collab heading — does it overflow the content box?
await p.setViewport({ width: 320, height: 700 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
const m = await p.evaluate(() => {
  const h = document.querySelector("#collabs h2");
  const r = h.getBoundingClientRect();
  return { text: h.textContent, left: Math.round(r.left), right: Math.round(r.right), viewport: 320, wraps: h.getClientRects().length };
});
console.log("320px collab heading:", JSON.stringify(m));
await p.evaluate(() => { window.__lenis?.stop(); window.scrollTo(0, document.getElementById("collabs").getBoundingClientRect().top + scrollY - 10); dispatchEvent(new Event("scroll")); });
await new Promise(r => setTimeout(r, 800));
await p.screenshot({ path: `${process.argv[2]}/c320.png`, clip: { x:0, y:0, width:320, height:220 } });
// 4k-ish
await p.setViewport({ width: 2560, height: 1400 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise(r => setTimeout(r, 2000));
await p.screenshot({ path: `${process.argv[2]}/hero2560.png` });
await b.close();
console.log("done");
