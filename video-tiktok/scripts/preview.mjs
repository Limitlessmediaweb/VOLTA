// Anteprima veloce: un fotogramma ogni STEP secondi (default 0,5) in preview/, senza motion blur.
// Uso: node scripts/preview.mjs [step] [da] [a]
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const step = Number(process.argv[2] ?? 0.5), from = Number(process.argv[3] ?? 0), to = Number(process.argv[4] ?? 22);
const OUT = new URL("../preview/", import.meta.url);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const server = spawn(process.execPath, [fileURLToPath(new URL("./serve.mjs", import.meta.url))], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 1080, height: 1920 } })).newPage();
page.on("pageerror", (e) => console.error("pageerror", e.message));
page.on("console", (m) => m.type() === "error" && console.error("console", m.text()));
await page.goto("http://localhost:4321/spot/index.html");
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) { console.error(err); process.exit(1); }
for (let t = from; t <= to + 1e-9; t += step) {
  await page.evaluate((x) => window.__render(x), t);
  writeFileSync(new URL(`t${t.toFixed(2).padStart(5, "0")}.jpg`, OUT), await page.screenshot({ type: "jpeg", quality: 85 }));
}
await b.close();
server.kill();
console.log("ok");
