// Screenshot Playwright di tutte le pagine a 390x844 e 1440x900. Uso: node scripts/screenshots.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3123";
const routes = ["/", "/servizi", "/chi-siamo", "/contatti", "/faq", "/privacy", "/termini", "/pagina-inesistente"];
const sizes = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1440, height: 900 },
];
mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();
const errors = [];
for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => sessionStorage.setItem("volta-intro", "1"));
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`[${s.name}] ${page.url()} ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${s.name}] ${page.url()} ${e.message}`));
  for (const r of routes) {
    const res = await page.goto(base + r, { waitUntil: "networkidle" });
    const slug = r === "/" ? "home" : r.slice(1);
    // scorre tutta la pagina per far partire le animazioni
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += s.height / 2) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `screenshots/${slug}-${s.name}.png` });
    console.log(`${slug}-${s.name} status=${res?.status()}`);
  }
  await ctx.close();
}
await browser.close();
if (errors.length) console.log("ERRORI CONSOLE:\n" + errors.join("\n"));
else console.log("Nessun errore in console");
