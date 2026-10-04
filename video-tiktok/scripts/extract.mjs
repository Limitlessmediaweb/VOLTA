// Estrae dal sito in produzione gli SVG reali (casa in sezione, wordmark, quadro elettrico),
// i fogli di stile e le classi next/font, e li salva in spot/assets/site.json.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const SITE = process.env.SITE || "http://localhost:3123";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await ctx.addInitScript(() => sessionStorage.setItem("volta-intro", "1"));
const p = await ctx.newPage();
await p.goto(SITE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);

const data = await p.evaluate(() => {
  const html = (sel) => document.querySelector(sel)?.outerHTML ?? null;
  return {
    htmlClass: document.documentElement.className,
    stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href")),
    house: html('svg[aria-label^="Casa disegnata"]'),
    logo: html('header a[aria-label^="VOLTA"] svg'),
    panel: html('svg[aria-label="Schema di un quadro elettrico domestico"]'),
  };
});
await b.close();

for (const k of ["house", "logo", "panel"]) if (!data[k]) throw new Error(`SVG non trovato: ${k}`);
writeFileSync(new URL("../spot/assets/site.json", import.meta.url), JSON.stringify(data, null, 2));
console.log("site.json:", data.stylesheets, data.htmlClass, Object.fromEntries(["house", "logo", "panel"].map((k) => [k, data[k].length])));
