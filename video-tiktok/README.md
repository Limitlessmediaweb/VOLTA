# VOLTA — spot verticale "Blackout" (TikTok / Reels)

Spot 9:16 per il portfolio LIMITLESS. Parte al buio totale: ogni **clic** di un interruttore accende qualcosa, fino ad accendere il sito.
Tutto in codice (SVG, CSS, GSAP) e con il **sito vero** catturato fotogramma per fotogramma. Nessuna immagine AI, nessun Higgsfield.

- File finale: `volta-spot-tiktok.mp4` (1080x1920, 60 fps, 22 s, H.264 High, yuv420p, CRF 18, preset slow, AAC muto, faststart)
- Se supera 30 MB viene creato anche `volta-spot-tiktok-share.mp4` (CRF 20, maxrate 9M)

## Variante usata (skill `limitless-video-sito`)

- **Hook**: (a) variante propria — buio totale + interruttore macro e testo grande "Adesso / accendi."
- **Presentazione**: (b) telefono in mockup CSS che ruota leggermente in 3D, poi monitor desktop CSS
- **Ritmo**: (b) veloce, tagli sul battito a 120 BPM, punch-in 100→110%
- **Transizioni**: solo luce — la finestra accesa del soggiorno che si allarga e diventa lo schermo del telefono (zoom-through), flash morbido, stacco al buio
- **Finale**: CTA con la lampadina del wordmark VOLTA che resta accesa (niente nero finale)

## Secondi dei clic (per musica e suono di interruttore)

120 BPM = un battito ogni 0,5 s. Ogni taglio cade su un battito.

| Secondo | Clic |
|---:|---|
| 1,0 | la levetta dell'interruttore scatta, parte il filo di luce, "Adesso" |
| 1,5 | "accendi." si accende come un neon |
| 2,5 | stacco: il filo disegna la casa in sezione |
| 3,5 | ingresso — "Sicura." |
| 4,5 | cucina — "Calda." |
| 5,0 | soggiorno — "Smart." |
| 5,5 | camera — "Tua." |
| 6,0 | giardino (solo luce, nessuna parola) |
| 6,5 | match cut: la finestra del soggiorno si allarga |
| 7,5 | nel telefono scatta l'interruttore dell'intro del sito |
| 9,0 | hero del sito + "Un sito che si accende mentre scorri." |
| 10,0 | stacco sulla casa del sito che si accende |
| 12,0 | stacco sugli scenari luce |
| 12,5 · 13,0 · 13,5 | tocchi su Mattina · Cena · Film |
| 14,0 | stacco sul quadro elettrico (scroll orizzontale) |
| 15,5 | stacco al buio: monitor desktop, cono di luce |
| 17,5 | la luce invade lo schermo desktop, casa accesa |
| 18,5 | ultimo clic: tutto spento tranne la lampadina di VOLTA |

Accensione piena della lampadina a 18,75 s. Testo finale da 19,25 s. Fine a 22,0 s con la luce accesa.

## Struttura

```
video-tiktok/
  volta-spot-tiktok.mp4      video finale
  clips/                     clip grezze del sito: intro.mp4, mobile.mp4, desktop.mp4 (+ frames/ e meta.json)
  spot/                      pagina di composizione (index.html + spot.js, GSAP/SplitText/DrawSVG locali)
  spot/assets/site.json      SVG reali estratti dal sito (casa, wordmark, quadro) + CSS e classi next/font
  scripts/
    serve.mjs                server statico :4321; gira /_next/* al sito (stessi CSS, token e font)
    extract.mjs              estrae gli SVG e i fogli di stile dal sito in produzione
    capture-site.mjs         cattura il sito a tempo virtuale (intro, mobile, desktop)
    render-spot.mjs          render dello spot fotogramma per fotogramma (CDP), motion blur a sotto-frame
    blend.py                 media dei sotto-frame in luce lineare
    preview.mjs              anteprima veloce (1 fotogramma ogni 0,5 s)
    encode.sh                bloom + grana + export H.264
    check.py                 ffprobe, frame neri/bianchi, lampeggi, contact sheet con safe zone
  check/contact-sheet.jpg    1 fotogramma al secondo con le safe zone disegnate
```

## Come rifarlo

```bash
# 1. sito in produzione (dalla cartella del sito)
npm run build && npx next start -p 3123
# 2. dalla cartella video-tiktok
node scripts/extract.mjs
node scripts/capture-site.mjs all
node scripts/preview.mjs 0.5          # controllo veloce in preview/
node scripts/render-spot.mjs 0 22
bash scripts/encode.sh
python scripts/check.py
```

Per un altro sito: cambia `SITE`, i selettori in `extract.mjs`/`capture-site.mjs` (sezioni da riprendere) e i testi in `spot/index.html`.

## Metodo di cattura

**Sito vero (clips/)** — Playwright + Chromium.
- Mobile: viewport 540x960 a DPR 2, quindi frame 1080x1920, emulazione iPhone (`isMobile`, `hasTouch`, user agent iPhone).
- Desktop: 1440x900.

**Orologio virtuale**: `page.clock.install()` + `pauseAt()` sostituiscono `Date`, `performance.now`, `setTimeout` e `requestAnimationFrame` *prima del caricamento*. GSAP, ScrollTrigger e Lenis avanzano solo con `clock.runFor(16,67 ms)`.

**Animazioni CSS**: le transizioni e le animazioni CSS non dipendono da rAF. Per questo, a ogni fotogramma ogni `document.getAnimations()` viene messa in pausa e portata avanti di 1/60 s (`currentTime`). Ogni fotogramma si cattura con CDP `Page.captureScreenshot`: niente fotogrammi persi, fluidità perfetta.

**Scroll**: `lenis.scrollTo` con easing easeInOutCubic, guidato dal tempo virtuale. Gli stacchi tra sezioni sono salti immediati sul battito. I 10 fotogrammi subito dopo un salto vengono saltati in composizione, perché contengono un residuo del pin di ScrollTrigger.

**Interazioni**:
- I tocchi sugli scenari luce sono `touchscreen.tap` reali; le coordinate sono salvate in `meta.json` e usate per disegnare il cerchio del tocco.
- Lo Spotlight desktop è guidato da `mouse.move` lungo una curva lenta. La stessa curva pilota la maschera del cono di luce sul monitor.

**L'intro del sito** è una clip separata (sessione nuova, `sessionStorage` vuoto). Nello spot parte dal clic della levetta (0,7 s), accelerata 3,2x.

**Scene in codice (spot/)**: la timeline GSAP è in pausa e `window.__render(t)` fa `seek(t)`, carica il fotogramma giusto delle clip e disegna il pulviscolo (deterministico).
- Gli SVG di casa, wordmark e quadro sono quelli **reali** del sito, estratti con `extract.mjs`.
- Font e colori sono quelli del sito: la pagina carica gli stessi CSS di Next (token in `@theme`, font `next/font` Syne, Manrope e JetBrains Mono).

**Effetti**:
- Motion blur: 5 sotto-frame mediati in luce lineare, solo dove serve (scatto della levetta, match cut e volo del telefono, luce che invade il desktop).
- Bloom in ffmpeg: copia delle sole alte luci, sfocata e sommata in `screen`.
- Grana fine temporale (`noise`).
- Vignettatura in CSS.
- Neri a `#070605`: profondi ma non schiacciati.

## Sicurezza fotosensibile

I clic sono accensioni nette distanziate di almeno 0,5 s. "accendi." ha un solo calo prima di accendersi. C'è un solo flash morbido per transizione. `check.py` conta i salti di luminanza oltre il 20% in ogni finestra di 1 s: devono essere al massimo 3.

## Safe zone

Nessun testo nei primi 150 px in alto, negli ultimi 380 px in basso e negli ultimi 140 px a destra. La scritta "LIMITLESS" (bianco 60%) sta in alto a destra, dentro la safe zone, da 0,8 s alla fine.
