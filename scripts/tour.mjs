// Tour della home: screenshot del viewport a varie altezze (sezioni fissate, casa, quadro). Uso: node scripts/tour.mjs [mobile|desktop] [light]
import { chromium } from "playwright";
const mode = process.argv[2] || "desktop";
const light = process.argv[3] === "light";
const vp = mode === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: vp, isMobile: mode === "mobile", hasTouch: mode === "mobile" });
await ctx.addInitScript((light) => { sessionStorage.setItem("volta-intro", "1"); if (light) localStorage.setItem("volta-theme", "light"); }, light);
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto((process.env.BASE || "http://localhost:3123") + "/", { waitUntil: "networkidle" });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
const n = Number(process.env.SHOTS || 22);
for (let i = 0; i < n; i++) {
  const y = Math.round((h - vp.height) * (i / (n - 1)));
  await page.mouse.wheel(0, 0);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `screenshots/tour-${mode}${light ? "-light" : ""}-${String(i).padStart(2, "0")}.png` });
}
console.log("altezza pagina", h);
await browser.close();
