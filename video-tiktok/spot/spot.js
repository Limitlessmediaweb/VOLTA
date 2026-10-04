/* VOLTA — spot "Blackout". Composizione a tempo controllato.
 * window.__render(t) porta la scena esattamente al secondo t (timeline GSAP in pausa + seek)
 * e carica il fotogramma giusto delle clip catturate dal sito vero. Nessuna dipendenza dal tempo reale.
 */
(() => {
  const FPS = 60;
  const DUR = 22;
  // Clic sul battito (120 BPM = un battito ogni 0,5 s). Riportati anche nel README.
  const CLICKS = [1.0, 1.5, 2.5, 3.5, 4.5, 5.0, 5.5, 6.0, 6.5, 7.5, 9.0, 10.0, 12.0, 12.5, 13.0, 13.5, 14.0, 15.5, 17.5, 18.5];

  const $ = (s) => document.querySelector(s);
  const stage = $("#stage");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", immediateRender: false } });
  const clips = {};
  const deskLight = { r: 0 };
  const glowState = { s: 0 };

  // ---------- caricamento ----------
  async function init() {
    gsap.registerPlugin(SplitText, DrawSVGPlugin);
    const site = await (await fetch("./assets/site.json")).json();
    document.documentElement.className = site.htmlClass;
    await Promise.all(
      site.stylesheets.map(
        (href) =>
          new Promise((res) => {
            const l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = href;
            l.onload = l.onerror = res;
            document.head.appendChild(l);
          }),
      ),
    );
    document.body.style.background = "#000";
    $("#house-svg-wrap").innerHTML = site.house;
    $("#final-logo").innerHTML = site.logo;

    for (const name of ["intro", "mobile", "desktop"]) clips[name] = await (await fetch(`../clips/${name}/meta.json`)).json();

    // font del sito (next/font) pronti prima di SplitText
    const fams = [".sp-display", ".sp-mono", "#stage"].map((s) => getComputedStyle($(s)).fontFamily);
    await Promise.all(fams.flatMap((f) => ["400", "600", "700"].map((w) => document.fonts.load(`${w} 64px ${f}`).catch(() => {}))));
    await document.fonts.ready;

    build();
    window.__ready = true;
  }

  // ---------- helper testo ----------
  const splitChars = (el) => SplitText.create(el, { type: "chars", mask: "chars" }).chars;
  const splitWords = (el) => SplitText.create(el, { type: "lines,words", mask: "lines" }).words;
  const show = (sel, at) => tl.set(sel, { autoAlpha: 1 }, at);
  const hide = (sel, at) => tl.set(sel, { autoAlpha: 0 }, at);
  const wordsIn = (words, at, d = 0.5) => tl.fromTo(words, { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: d, stagger: 0.045, ease: "expo.out" }, at);
  const wordsOut = (words, at) => tl.to(words, { yPercent: -115, duration: 0.18, stagger: 0.015, ease: "power2.in" }, at);

  function build() {
    const scenes = ["#hook", "#house", "#phone-scene", "#desk-scene", "#final", "#zoom"];
    gsap.set(scenes, { autoAlpha: 0 });

    // Scossa minima della camera su ogni clic
    for (const c of CLICKS) tl.fromTo("#world", { scale: 1.016 }, { scale: 1, duration: 0.32, ease: "power2.out" }, c);
    show("#brand", 0.8);

    // ===== 0,0–0,8 nero: "Spegni tutto." =====
    gsap.set("#hook", { autoAlpha: 1 });
    gsap.set(["#switch-wrap", "#hook-wire", "#hook-words"], { autoAlpha: 0 });
    hide("#off-text", 0.8);

    // ===== 0,8–2,5 hook: interruttore macro, CLIC, filo, "Adesso / accendi." =====
    show("#switch-wrap", 0.8);
    gsap.set("#switch", { rotationX: 16, rotationY: -26, rotationZ: -4, scale: 1.05 });
    gsap.set("#lever", { rotationX: -34 });
    tl.fromTo("#switch", { opacity: 0.25 }, { opacity: 1, duration: 0.18, ease: "none" }, 0.8);
    tl.to("#switch", { rotationY: -14, rotationX: 10, scale: 1.14, duration: 1.7, ease: "sine.inOut" }, 0.8);
    // clic 1,0
    tl.to("#lever", { rotationX: 34, duration: 0.07, ease: "power4.in" }, 1.0);
    tl.set("#led", { background: "#ffc857", boxShadow: "0 0 18px 6px rgb(255 200 87 / .8)" }, 1.0);
    tl.set("#lever-light", { opacity: 1 }, 1.02);
    show("#hook-wire", 1.0);
    tl.fromTo("#wire1", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.6, ease: "power2.in" }, 1.0);
    show("#hook-words", 1.0);
    const adesso = splitChars("#w-adesso");
    tl.fromTo(adesso, { yPercent: 110 }, { yPercent: 0, duration: 0.42, stagger: 0.03, ease: "expo.out" }, 1.0);
    // "accendi." si accende come un neon, una volta (un solo calo, niente strobo)
    const accendi = splitChars("#w-accendi");
    gsap.set(accendi, { opacity: 0 });
    tl.fromTo(accendi, { yPercent: 40 }, { yPercent: 0, duration: 0.3, stagger: 0.02, ease: "expo.out" }, 1.5);
    tl.set(accendi, { opacity: 0.7 }, 1.5)
      .set(accendi, { opacity: 0.3 }, 1.62)
      .to(accendi, { opacity: 1, duration: 0.25, ease: "power2.out" }, 1.8)
      .fromTo("#w-accendi", { textShadow: "0 0 0 transparent" }, { textShadow: "0 0 30px rgb(255 200 87 / .75), 0 0 80px rgb(255 200 87 / .4)", duration: 0.4 }, 1.8);
    tl.to("#hook", { scale: 1.05, duration: 1.7, ease: "none" }, 0.8);
    hide("#hook", 2.5);

    // ===== 2,5–6,5 la casa: il filo la disegna, 4 clic accendono 4 stanze =====
    show("#house", 2.5);
    const houseSvg = $("#house-svg-wrap svg");
    const glows = (id) => houseSvg.querySelectorAll(`[data-room="${id}"] .room-glow`);
    const lamps = (id) => houseSvg.querySelectorAll(`[data-room="${id}"] .room-lamp`);
    gsap.set(houseSvg.querySelectorAll(".room-glow, .room-lamp"), { opacity: 0 });
    gsap.set("#house-svg-wrap", { opacity: 0 });
    tl.fromTo("#ol-main", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.85, ease: "power2.inOut" }, 2.5);
    tl.fromTo("#ol-floor", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.45, ease: "power2.out" }, 3.0);
    tl.to("#house-svg-wrap", { opacity: 1, duration: 0.35, ease: "none" }, 3.1);
    tl.to("#outline", { opacity: 0.3, duration: 0.5, ease: "none" }, 3.4);
    tl.fromTo("#cam", { scale: 1, x: 0, y: 0 }, { scale: 1.32, x: -30, y: -70, duration: 4, ease: "sine.inOut" }, 2.5);

    const roomSeq = [
      { id: "ingresso", at: 3.5, word: "Sicura.", cap: "01 · Ingresso — sicurezza e videocitofono" },
      { id: "cucina", at: 4.5, word: "Calda.", cap: "02 · Cucina — impianto e induzione" },
      { id: "soggiorno", at: 5.0, word: "Smart.", cap: "03 · Soggiorno — scenari luce e domotica" },
      { id: "camera", at: 5.5, word: "Tua.", cap: "04 · Camera — luce che segue l'ora" },
    ];
    const wordsBox = $("#room-words");
    const capBox = $("#room-caption");
    let prev = null;
    roomSeq.forEach((r, i) => {
      // accensione netta (un solo scatto), poi assestamento
      tl.fromTo(glows(r.id), { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "power2.out" }, r.at);
      tl.to(glows(r.id), { opacity: 0.82, duration: 0.5, ease: "sine.out" }, r.at + 0.1);
      tl.set(lamps(r.id), { opacity: 1 }, r.at);
      const w = document.createElement("div");
      w.innerHTML = `<div class="sp-mask"><div>${r.word}</div></div>`;
      wordsBox.appendChild(w);
      const chars = splitChars(w.firstChild.firstChild);
      gsap.set(chars, { yPercent: 115 });
      if (prev) tl.to(prev, { yPercent: -115, duration: 0.16, stagger: 0.012, ease: "power2.in" }, r.at - 0.02);
      tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.38, stagger: 0.028, ease: "expo.out" }, r.at);
      prev = chars;
      const c = document.createElement("span");
      c.textContent = r.cap;
      c.style.cssText = "position:absolute;left:0;top:0;white-space:nowrap;opacity:0";
      capBox.appendChild(c);
      tl.set(c, { opacity: 1 }, r.at).set(c, { opacity: 0 }, roomSeq[i + 1]?.at ?? 6.5);
    });
    // esterno sul battito 6,0, senza parola
    tl.fromTo(glows("esterno"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 6.0);
    tl.set(lamps("esterno"), { opacity: 1 }, 6.0);
    tl.to(prev, { yPercent: -115, duration: 0.15, stagger: 0.01, ease: "power2.in" }, 6.45);

    // ===== 6,5–7,5 match cut: la finestra accesa del soggiorno diventa lo schermo del telefono =====
    tl.seek(6.499, true);
    const sr = houseSvg.querySelector('[data-room="soggiorno"] rect').getBoundingClientRect();
    const st = stage.getBoundingClientRect();
    tl.seek(0, true);
    tl.set("#zoom", { autoAlpha: 1, left: sr.left - st.left, top: sr.top - st.top, width: sr.width, height: sr.height }, 6.5);
    tl.to("#zoom", { left: 0, top: 0, width: 1080, height: 1920, duration: 0.35, ease: "power3.in" }, 6.5);
    tl.to("#cam", { scale: 4.2, x: -140, y: -360, duration: 0.35, ease: "power3.in" }, 6.5);
    hide("#house", 6.85);
    hide("#zoom", 6.85);
    show("#phone-scene", 6.85);
    // posa iniziale: lo schermo del telefono copre esattamente lo stage (1080x1920)
    gsap.set("#phone", { y: -30, scale: 1920 / 1138, rotationY: 0, rotationX: 0 });
    gsap.set("#phone-halo", { opacity: 0 });
    gsap.set("#site-texts > div", { autoAlpha: 0 });
    tl.set("#screen-glow", { opacity: 1 }, 6.85);
    tl.to("#screen-glow", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 6.95);
    tl.fromTo("#flash", { opacity: 0.32 }, { opacity: 0, duration: 0.35, ease: "power2.out" }, 6.85);
    tl.to("#phone", { y: 0, scale: 0.9, rotationY: -16, rotationX: 7, duration: 0.65, ease: "power3.out" }, 6.85);
    tl.to("#phone-halo", { opacity: 1, duration: 0.8, ease: "none" }, 7.0);

    // ===== 7,5–15,5 il sito vero dentro il telefono =====
    tl.to("#phone", { rotationY: -5, rotationX: 3, duration: 3.5, ease: "sine.inOut" }, 7.5);
    tl.to("#phone", { rotationY: -10, rotationX: 5, duration: 4.5, ease: "sine.inOut" }, 11.0);
    // punch-in rapidi 100% → 110% (casa accesa, scenari luce)
    tl.to("#phone-pos", { scale: 1.1, duration: 0.14, ease: "power3.out" }, 11.0);
    tl.set("#phone-pos", { scale: 1 }, 12.0);
    tl.to("#phone-pos", { scale: 1.1, duration: 0.14, ease: "power3.out" }, 12.5);
    tl.set("#phone-pos", { scale: 1 }, 14.0);
    // tocchi simulati sugli scenari (posizioni registrate dalla cattura)
    const taps = clips.mobile.events.filter((e) => e.tap);
    taps.forEach((e, i) => {
      const at = 9.0 + e.t;
      const k = 640 / 540;
      tl.set(`#rip${i}`, { left: e.tap.x * k, top: e.tap.y * k }, at);
      tl.fromTo(`#rip${i}`, { scale: 0.4, opacity: 0.95 }, { scale: 1.35, opacity: 0, duration: 0.45, ease: "power2.out" }, at);
    });
    // testi brevi, uno alla volta
    [
      { el: "#st0", at: 9.0, out: 10.35 },
      { el: "#st1", at: 10.5, out: 11.85 },
      { el: "#st2", at: 12.5, out: 13.85 },
    ].forEach((s) => {
      show(s.el, s.at);
      const w = splitWords(s.el);
      gsap.set(w, { yPercent: 115 });
      wordsIn(w, s.at, 0.5);
      wordsOut(w, s.out);
    });
    hide("#phone-scene", 15.5);

    // ===== 15,5–18,5 desktop: monitor al buio, l'hero compare solo nel cono di luce =====
    show("#desk-scene", 15.5);
    gsap.set("#monitor", { rotationY: 8, rotationX: 4 });
    tl.to("#monitor", { rotationY: -5, rotationX: 2, duration: 3, ease: "sine.inOut" }, 15.5);
    tl.fromTo(deskLight, { r: 0 }, { r: 270, duration: 0.3, ease: "power2.out" }, 15.5);
    tl.to(deskLight, { r: 1700, duration: 0.3, ease: "power2.in" }, 17.5);
    const dtext = splitWords("#desk-text");
    gsap.set(dtext, { yPercent: 115 });
    wordsIn(dtext, 15.6, 0.5);
    wordsOut(dtext, 18.3);
    gsap.set("#bezel", { boxShadow: "inset 0 0 0 2px rgb(255 246 229 / .06), 0 50px 100px -30px #000" });
    tl.set("#bezel", { boxShadow: "inset 0 0 0 2px rgb(255 246 229 / .16), 0 50px 100px -30px #000, 0 0 160px -30px rgb(255 200 87 / .5)" }, 17.5);
    hide("#desk-scene", 18.5);

    // ===== 18,5–22 finale: resta accesa solo la lampadina del wordmark =====
    show("#final", 18.5);
    const BX = 110 + (78 / 262) * 800;
    const BY = 497 + (26 / 66) * ((800 * 66) / 262);
    gsap.set("#final-glow", { left: BX, top: BY, scale: 0.12, opacity: 0.9 });
    const letters = "#final-logo [data-logo='letters'], #final-logo [data-logo='bulb']";
    gsap.set(letters, { opacity: 0.1 });
    gsap.set("#final-logo [data-logo='filament']", { opacity: 1, filter: "drop-shadow(0 0 6px #ffc857)" });
    tl.fromTo(glowState, { s: 0.12 }, { s: 1, duration: 0.8, ease: "expo.out" }, 18.75);
    tl.to("#final-glow", { scale: 1, duration: 0.8, ease: "expo.out" }, 18.75);
    tl.to(letters, { opacity: 1, duration: 0.6, ease: "power2.out" }, 18.85);
    tl.to("#final-glow", { scale: 1.07, duration: 2.2, ease: "sine.inOut" }, 19.8);
    tl.fromTo("#flash", { opacity: 0.14 }, { opacity: 0, duration: 0.5 }, 18.75);
    const ft = splitWords("#final-title");
    gsap.set(ft, { yPercent: 115 });
    wordsIn(ft, 19.25, 0.6);
    const fs = splitWords("#final-sub");
    gsap.set(fs, { yPercent: 115 });
    wordsIn(fs, 19.9, 0.5);
    const fn = splitWords("#final-note");
    gsap.set(fn, { yPercent: 115 });
    wordsIn(fn, 20.3, 0.5);
    tl.to("#final-logo", { scale: 1.03, duration: 3.5, ease: "sine.inOut", transformOrigin: "30% 40%" }, 18.5);

    tl.set({}, {}, DUR);
  }

  // ---------- pulviscolo nei coni di luce (deterministico) ----------
  const dust = $("#dust").getContext("2d");
  const rnd = (i, k) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const P = Array.from({ length: 90 }, (_, i) => ({ x: rnd(i, 1) * 1080, y: rnd(i, 2) * 1920, s: 1 + rnd(i, 3) * 2.4, vx: (rnd(i, 4) - 0.5) * 14, vy: -6 - rnd(i, 5) * 16, ph: rnd(i, 6) * 6.28, a: 0.35 + rnd(i, 7) * 0.6 }));

  function lightsAt(t) {
    const L = [];
    if (t >= 1.0 && t < 2.5) L.push([540, 760, 520, Math.min(1, (t - 1) * 3)]);
    if (t >= 3.4 && t < 6.85) L.push([590, 1060, 620, Math.min(1, (t - 3.4) * 0.5)]);
    if (t >= 7.2 && t < 15.5) L.push([540, 990, 740, 0.55]);
    if (t >= 15.5 && t < 18.5) {
      const m = mouseAt(t);
      L.push(t < 17.5 ? [40 + 26 + m.x * (948 / 1440), 630 + 26 + m.y * (948 / 1440), 330, 1] : [540, 930, 760, 0.6]);
    }
    if (t >= 18.6) L.push([348, 576, 700, Math.min(1, glowState.s)]);
    return L;
  }

  function drawDust(t) {
    dust.clearRect(0, 0, 1080, 1920);
    const L = lightsAt(t);
    if (!L.length) return;
    for (const p of P) {
      const x = (((p.x + p.vx * t + Math.sin(t * 0.7 + p.ph) * 18) % 1080) + 1080) % 1080;
      const y = (((p.y + p.vy * t + Math.cos(t * 0.5 + p.ph) * 12) % 1920) + 1920) % 1920;
      let a = 0;
      for (const [lx, ly, r, k] of L) {
        const d = Math.hypot(x - lx, y - ly);
        if (d < r) a = Math.max(a, k * Math.pow(1 - d / r, 1.6));
      }
      if (a < 0.02) continue;
      const tw = 0.65 + 0.35 * Math.sin(t * 2.3 + p.ph * 3);
      const g = dust.createRadialGradient(x, y, 0, x, y, p.s * 2.2);
      g.addColorStop(0, `rgba(255,232,190,${(a * p.a * tw).toFixed(3)})`);
      g.addColorStop(1, "rgba(255,232,190,0)");
      dust.fillStyle = g;
      dust.beginPath();
      dust.arc(x, y, p.s * 2.2, 0, 6.283);
      dust.fill();
    }
  }

  // ---------- clip del sito ----------
  function mouseAt(t) {
    const pf = clips.desktop.perFrame || [];
    const i = Math.max(0, Math.min(pf.length - 1, Math.round((t - 15.5) * FPS)));
    return pf[i] || { x: 1300, y: 860 };
  }
  const pad = (n) => String(n).padStart(5, "0");
  /** Salta i 10 fotogrammi subito dopo uno stacco immediato nella cattura (residui del pin). */
  function cleanIdx(clip, idx) {
    for (const e of clip.events || []) {
      if (!e.cut) continue;
      const c = Math.round(e.t * FPS);
      if (idx >= c && idx < c + 10) return c + 10;
    }
    return Math.max(0, Math.min(clip.frames - 1, idx));
  }
  function screenFrame(t) {
    if (t < 6.85 || t >= 15.5) return null;
    if (t < 7.5) return `../clips/intro/frames/${pad(42)}.jpg`;
    if (t < 9.0) {
      const ct = 0.7 + (t - 7.5) * ((5.5 - 0.7) / 1.5);
      return `../clips/intro/frames/${pad(Math.min(clips.intro.frames - 1, Math.round(ct * FPS)))}.jpg`;
    }
    return `../clips/mobile/frames/${pad(cleanIdx(clips.mobile, Math.round((t - 9.0) * FPS)))}.jpg`;
  }
  function deskFrame(t) {
    if (t < 15.5 || t >= 18.5) return null;
    return `../clips/desktop/frames/${pad(cleanIdx(clips.desktop, Math.round((t - 15.5) * FPS)))}.jpg`;
  }
  async function setImg(img, src) {
    if (!src || img.dataset.src === src) return;
    img.dataset.src = src;
    img.src = src;
    await img.decode().catch(() => {});
  }

  // ---------- render ----------
  window.__render = async (t) => {
    t = Math.max(0, Math.min(DUR, t));
    tl.seek(t, true);
    await setImg($("#screen-img"), screenFrame(t));
    const df = deskFrame(t);
    await setImg($("#desk-img"), df);
    if (df) {
      const m = mouseAt(t);
      const k = 948 / 1440;
      const r = deskLight.r;
      const mask = `radial-gradient(circle at ${m.x * k}px ${m.y * k}px, #000 0px, #000 ${r * 0.45}px, rgba(0,0,0,.35) ${r * 0.8}px, transparent ${r}px)`;
      const ds = $("#dscreen");
      ds.style.webkitMaskImage = mask;
      ds.style.maskImage = mask;
    }
    drawDust(t);
    return t;
  };
  window.__meta = { FPS, DUR, CLICKS };

  init().catch((e) => {
    window.__error = String(e && e.stack ? e.stack : e);
    console.error(e);
  });
})();
