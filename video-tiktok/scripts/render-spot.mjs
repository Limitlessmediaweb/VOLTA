// Render dello spot fotogramma per fotogramma: Playwright + CDP Page.captureScreenshot.
// Motion blur: negli intervalli BLUR ogni fotogramma è la media di 5 sotto-fotogrammi presi DOPO l'istante t
// (shutter 360°, mai a cavallo di un clic: niente immagini doppie sui tagli).
// Uso: node scripts/render-spot.mjs [da_secondi] [a_secondi]
import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FPS = 60, DUR = 22;
const from = Number(process.argv[2] ?? 0), to = Number(process.argv[3] ?? DUR);
const BLUR = [[0.98, 1.14], [6.5, 7.5], [17.5, 17.85]];
const SUB = 5;
const OUT = new URL("../frames/", import.meta.url);
const SUBDIR = new URL("../frames/sub/", import.meta.url);
mkdirSync(OUT, { recursive: true });
rmSync(SUBDIR, { recursive: true, force: true });
mkdirSync(SUBDIR, { recursive: true });

const server = spawn(process.execPath, [fileURLToPath(new URL("./serve.mjs", import.meta.url))], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.error("pageerror", e.message));
await page.goto("http://localhost:4321/spot/index.html");
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) throw new Error(err);
const cdp = await ctx.newCDPSession(page);
const grab = async () => Buffer.from((await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 95 })).data, "base64");

const blurJobs = [];
const f0 = Math.round(from * FPS), f1 = Math.min(Math.round(to * FPS), DUR * FPS);
for (let f = f0; f < f1; f++) {
  const t = f / FPS;
  const name = `${String(f).padStart(5, "0")}.jpg`;
  if (BLUR.some(([a, z]) => t >= a && t < z)) {
    const subs = [];
    for (let k = 0; k < SUB; k++) {
      await page.evaluate((x) => window.__render(x), t + k / (FPS * SUB));
      const p = fileURLToPath(new URL(`${f}_${k}.jpg`, SUBDIR));
      writeFileSync(p, await grab());
      subs.push(p);
    }
    blurJobs.push([fileURLToPath(new URL(name, OUT)), ...subs]);
  } else {
    await page.evaluate((x) => window.__render(x), t);
    writeFileSync(new URL(name, OUT), await grab());
  }
  if (f % 60 === 0) process.stdout.write(`${t.toFixed(0)}s `);
}
await b.close();
server.kill();

if (blurJobs.length) {
  const list = fileURLToPath(new URL("blur-jobs.json", SUBDIR));
  writeFileSync(list, JSON.stringify(blurJobs));
  execFileSync("python", [fileURLToPath(new URL("./blend.py", import.meta.url)), list], { stdio: "inherit" });
}
console.log(`\n✓ fotogrammi ${f0}–${f1 - 1} (${blurJobs.length} con motion blur)`);
