// Cattura del sito VERO fotogramma per fotogramma, a tempo virtuale.
//
// Metodo: Playwright `page.clock` sostituisce Date, performance.now, setTimeout e requestAnimationFrame
// prima del caricamento (quindi GSAP, ScrollTrigger e Lenis avanzano solo quando lo diciamo noi).
// Le animazioni/transizioni CSS (Web Animations) vengono messe in pausa e fatte avanzare a mano
// con `currentTime += 1/60 s`. Ogni fotogramma: clock.runFor(16,67 ms) → avanzamento CSS → CDP Page.captureScreenshot.
//
// Uso: node scripts/capture-site.mjs [intro|mobile|desktop|all]
import { chromium, devices } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const SITE = process.env.SITE || "http://localhost:3123";
const FPS = 60;
const DT = 1000 / FPS;
const OUT = new URL("../clips/", import.meta.url);
const which = process.argv[2] || "all";

const MOBILE = {
  ...devices["iPhone 13"],
  viewport: { width: 540, height: 960 },
  screen: { width: 540, height: 960 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // easeInOutCubic
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(browser, opts, { intro }) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript((intro) => {
    if (!intro) sessionStorage.setItem("volta-intro", "1");
    else sessionStorage.removeItem("volta-intro");
    // Avanzamento manuale delle animazioni CSS / WAAPI
    window.__stepAnims = (dt) => {
      for (const a of document.getAnimations()) {
        if (a.__vt === undefined) a.__vt = 0;
        a.pause();
        a.__vt += dt;
        a.currentTime = a.__vt;
      }
    };
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = "::-webkit-scrollbar{display:none!important} html{scrollbar-width:none!important}";
      document.head.appendChild(s);
    });
  }, intro);
  const page = await ctx.newPage();
  const T0 = new Date("2026-10-04T09:00:00").getTime();
  await page.clock.install({ time: T0 });
  await page.clock.pauseAt(T0 + 1000); // il tempo avanza SOLO con runFor
  await page.goto(SITE + "/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // attesa reale dell'idratazione (Lenis viene creato in un effetto); il tempo virtuale avanza di poco
  for (let i = 0; i < 100 && !(await page.evaluate(() => !!window.__lenis)); i++) {
    await page.clock.runFor(DT);
    await sleep(60);
  }
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}

async function tick(page) {
  await page.clock.runFor(DT);
  await page.evaluate((dt) => window.__stepAnims(dt), DT);
}

async function shot(cdp, dir, i) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 93, captureBeyondViewport: false });
  writeFileSync(new URL(`${String(i).padStart(5, "0")}.jpg`, dir), Buffer.from(data, "base64"));
}

function prepDir(name) {
  const dir = new URL(`${name}/frames/`, OUT);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Esegue una timeline: actions = [{ at: secondi, run: async (page) => {} }], per `dur` secondi. */
async function record(name, { page, cdp }, dur, actions, perFrame) {
  const dir = prepDir(name);
  const n = Math.round(dur * FPS);
  const meta = { name, fps: FPS, frames: n, events: [] };
  const queue = [...actions].sort((a, b) => a.at - b.at);
  for (let i = 0; i < n; i++) {
    const t = i / FPS;
    while (queue.length && queue[0].at <= t + 1e-6) {
      const a = queue.shift();
      const ev = await a.run(page, t);
      if (ev) meta.events.push({ t, ...ev });
    }
    if (perFrame) {
      const ev = await perFrame(page, t, i);
      if (ev) (meta.perFrame ||= []).push(ev);
    }
    await tick(page);
    await shot(cdp, dir, i);
    if (i % 60 === 0) process.stdout.write(`${name} ${t.toFixed(1)}s `);
  }
  writeFileSync(new URL(`${name}/meta.json`, OUT), JSON.stringify(meta, null, 2));
  console.log(`\n✓ ${name}: ${n} fotogrammi`);
}

// Scroll con easing guidato dal tempo virtuale (Lenis, se presente)
const scrollTo = (y, duration, immediate = false) => async (page) => {
  await page.evaluate(
    ({ y, duration, immediate }) => {
      const l = window.__lenis;
      if (l) l.scrollTo(y, immediate ? { immediate: true, force: true } : { duration, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), force: true });
      else window.scrollTo(0, y);
    },
    { y, duration, immediate },
  );
};

/** Posizioni utili della home (calcolate dopo l'idratazione). */
async function positions(page) {
  return page.evaluate(() => {
    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    const house = document.querySelector('section[aria-label="La casa che si accende"]');
    const houseSpacer = house.parentElement.classList.contains("pin-spacer") ? house.parentElement : house;
    const scenes = document.querySelector('section[aria-labelledby="scene-title"]');
    const panel = document.querySelector('section[aria-label="Dentro il quadro elettrico"]');
    const panelSpacer = panel.parentElement.classList.contains("pin-spacer") ? panel.parentElement : panel;
    const sceneBtns = document.querySelector('[aria-label="Scegli uno scenario"]');
    return {
      vh: innerHeight,
      houseStart: top(houseSpacer),
      houseEnd: top(houseSpacer) + houseSpacer.offsetHeight - innerHeight,
      scenesButtons: top(sceneBtns),
      panelStart: top(panelSpacer),
      panelEnd: top(panelSpacer) + panelSpacer.offsetHeight - innerHeight,
    };
  });
}

async function tapScene(page, label) {
  const box = await page.locator(`[aria-label="Scegli uno scenario"] button:has-text("${label}")`).boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.touchscreen.tap(x, y);
  return { tap: { x, y, label } };
}

const browser = await chromium.launch();

// 1) INTRO del sito (sessione nuova), 5,6 s
if (which === "all" || which === "intro") {
  const s = await open(browser, MOBILE, { intro: true });
  await record("intro", s, 5.6, []);
  await s.ctx.close();
}

// 2) MOBILE: hero → casa che si accende → scenari luce (tocchi) → quadro. 6,5 s
//    Gli stacchi immediati cadono su battiti (t = 1,0 / 3,0 / 5,0 → nello spot 10,0 / 12,0 / 14,0 s).
if (which === "all" || which === "mobile") {
  const s = await open(browser, MOBILE, { intro: false });
  for (let i = 0; i < 100; i++) await tick(s.page); // assestamento (font, ScrollTrigger)
  await s.page.evaluate(() => window.dispatchEvent(new Event("resize")));
  for (let i = 0; i < 20; i++) await tick(s.page);
  const P = await positions(s.page);
  console.log("posizioni mobile", P);
  await record("mobile", s, 6.5, [
    { at: 0.05, run: scrollTo(260, 0.95) },
    { at: 1.0, run: async (p) => { await scrollTo(P.houseStart + 4, 0, true)(p); return { cut: "casa" }; } },
    { at: 1.02, run: scrollTo(P.houseEnd - 30, 1.95) },
    { at: 3.0, run: async (p) => { await scrollTo(P.scenesButtons - 150, 0, true)(p); return { cut: "scenari" }; } },
    { at: 3.5, run: (p) => tapScene(p, "Mattina") },
    { at: 4.0, run: (p) => tapScene(p, "Cena") },
    { at: 4.5, run: (p) => tapScene(p, "Film") },
    { at: 5.0, run: async (p) => { await scrollTo(P.panelStart + 4, 0, true)(p); return { cut: "quadro" }; } },
    { at: 5.02, run: scrollTo(P.panelEnd - 10, 1.45) },
  ]);
  await s.ctx.close();
}

// 3) DESKTOP: hero al buio con lo Spotlight guidato da un mouse lento a curva, poi casa accesa. 3,0 s
if (which === "all" || which === "desktop") {
  const s = await open(browser, DESKTOP, { intro: false });
  for (let i = 0; i < 60; i++) await tick(s.page);
  const P = await positions(s.page);
  await s.page.mouse.move(380, 520);
  await record(
    "desktop",
    s,
    3.0,
    [{ at: 2.0, run: async (p) => { await scrollTo(P.houseEnd - 20, 0, true)(p); await p.mouse.move(1300, 860); return { cut: "casa" }; } }],
    async (page, t) => {
      if (t >= 2.0) return null;
      // curva lenta: da sinistra in basso, arco sopra il titolo, verso destra
      const k = ease(Math.min(1, t / 2.0));
      const x = 380 + 820 * k;
      const y = 520 - 230 * Math.sin(k * Math.PI) + 60 * Math.sin(k * Math.PI * 3);
      await page.mouse.move(x, y);
      return { t, x, y };
    },
  );
  await s.ctx.close();
}

await browser.close();
