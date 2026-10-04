# VOLTA — sito concept (LIMITLESS)

Sito premium per un brand **inventato**: impianti elettrici, illuminazione e domotica. Nessuna foto, nessun video: tutto il visivo è SVG, CSS e GSAP. Il sito parte al buio e si accende con lo scroll e col puntatore.

> Progetto concept — VOLTA è un brand inventato. Badge "Versione demo" sempre visibile in alto.

## Comandi

```bash
npm install
npm run dev          # sviluppo su http://localhost:3000
npm run build        # build di produzione + controllo alt (postbuild)
npm run start        # serve la build
npm run lint         # ESLint + controllo <img> senza alt
npm run check:alt    # solo controllo alt (sorgenti + HTML generato)
node scripts/screenshots.mjs http://localhost:3123   # screenshot Playwright 390x844 e 1440x900 di tutte le pagine
node scripts/tour.mjs mobile|desktop [light]         # screenshot della home a varie altezze di scroll
npx lighthouse http://localhost:3123/ --port=9333 --output=json --output-path=./lh.json && node scripts/lh-report.mjs
```

Gli screenshot finiscono in `screenshots/`.

## Variabili d'ambiente

Copia `.env.example` in `.env.local`.

| Variabile | Default | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | canonical, sitemap, Open Graph, JSON-LD |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | finché non è `"true"`: `noindex, nofollow` su tutte le pagine e `robots.txt` con `Disallow: /` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | vuota | se impostata carica Plausible (senza cookie) e attiva `track()` |
| `NEXT_PUBLIC_LIMITLESS_URL` | `https://example.com` | link del credito "Realizzato e gestito da LIMITLESS" nel footer |

## Struttura

```
src/app                 pagine (/, /servizi, /chi-siamo, /contatti, /faq, /privacy, /termini, 404), robots, sitemap, OG image, icona
src/components/motion   Intro, Spotlight, HouseLights, PinnedSteps, HorizontalScroll, SplitReveal, ScrambleText,
                        Reveal/Stagger, FlickerText, Marquee, TiltCard, MagneticButton, ParallaxLayer, ScrollProgress,
                        Counter, PageTransition, CursorFollower, DrawUnderline, SmoothScroll (Lenis), DyingBulb (404)
src/components/sections Hero, Emergency, HouseSection, Services, Scenes, PanelSection, Commitments/Stats, FaqSection, Contact, FinalCta
src/components/ui       Header, Footer, MobileCallBar, ThemeToggle, Logo (wordmark SVG), Accordion, QuoteForm, ZoneMap, …
src/data                dati tipizzati (business, servizi, stanze, scenari, quadro, FAQ, impegni)
src/lib                 gsap (plugin), seo (metadata + JSON-LD), analytics (track), site (env)
public/brand            logo.svg
scripts                 check-alt, screenshots, tour, lighthouse
```

## Elenco dei `[DA COMPLETARE]`

Tutti in `src/data/business.ts` (i `null` diventano segnaposto visibili):

- Telefono, email, indirizzo (via, città, CAP, provincia), **zona servita**, P.IVA
- Orari (lun–ven, sabato) e orari del pronto intervento
- `priceRange` e `openingHours` nel JSON-LD `Electrician` (`src/lib/seo.ts`)
- Pagina **Chi siamo**: storia, team, abilitazioni, fornitori (solo struttura)
- Esito del form: tempi di ricontatto; collegamento a un backend (`// TODO` in `QuoteForm.tsx`)
- Privacy e Termini: titolare, sede, email privacy, tempi di conservazione, hosting, servizio email, foro competente, data aggiornamento (`[DA DEFINIRE]`)

Da **confermare/verificare con il cliente**: impegni in "Come lavoriamo" (`src/data/content.ts`), adeguamenti e documentazione/certificazioni (servizi e FAQ), regole per locali pubblici (FAQ), numeri della sezione "In numeri" (**Dati dimostrativi**, da sostituire o eliminare).

## Decisioni prese

- **Next.js 16.3 (App Router, Turbopack)**, React 19.2, Tailwind 4 con token in `@theme inline` che puntano a variabili CSS: il tema chiaro cambia solo le variabili (`html[data-theme="light"]`).
- **GSAP 3.15**: SplitText, ScrambleText, DrawSVG, MorphSVG e Flip sono gratuiti e inclusi nel pacchetto `gsap` (verificato in `node_modules/gsap`). Registrazione unica in `src/lib/gsap.ts`. Ogni componente usa `useGSAP` + `gsap.matchMedia()` (cleanup automatico, desktop/mobile, `prefers-reduced-motion`).
- **Lenis** collegato al ticker GSAP e a `ScrollTrigger.update`; spento con reduced-motion. `ScrollTrigger.refresh()` dopo `document.fonts.ready` e a ogni cambio pagina.
- **Script di boot inline** in `<head>`: applica tema salvato, classe `motion` e flag intro *prima del paint* (niente flash). Le classi custom (`.btn`, `.t-*`, `.field`) sono in `@layer components` per non scavalcare le utility Tailwind.
- **Intro** (≈4,6 s, una volta per sessione via `sessionStorage`): interruttore HTML con rotazione 3D, filo e casa in DrawSVG, punto → lampadina → wordmark, un solo flash morbido. L'hero è già renderizzato sotto; pulsante "Salta" + tasto Esc; failsafe CSS a 7 s; con reduced-motion dissolvenza di 0,3 s.
- **LCP**: l'h1 dell'hero non usa la maschera e parte da opacità 0,02 (non 0) così resta un candidato LCP anche sotto l'intro.
- **Spotlight**: maschera `radial-gradient` con `@property` per interpolare il raggio (guida modern-web-guidance "interactive-content-reveal"). Lo strato rivelato è solo decorativo (`aria-hidden`): il contenuto è sempre leggibile. Desktop: puntatore + rAF; touch: la luce scende con lo scroll.
- **Casa che si accende**: SVG unico, aloni con `radialGradient` (niente `filter: blur`), le stanze si accendono cumulativamente animando solo l'opacità. Senza JS/reduced-motion: casa tutta accesa e passi in lista.
- **Quadro elettrico**: pin + traccia orizzontale; senza JS/reduced-motion diventa uno scroll orizzontale nativo con scroll-snap.
- **Scenari luce**: pulsanti `aria-pressed`, indicatore animato con Flip, sole↔luna con MorphSVG, slider intensità con `output`; ogni scenario descritto anche a testo (temperatura, effetto) → nessuna informazione solo nella luce.
- **Rosso emergenza**: `#E5484D` usato per bordi/icone; il testo usa `#FF8F92` (scuro) / `#A82A2F` (chiaro) per il contrasto AA. In tema chiaro l'accento testuale è `#8A5D00` (il `#B27A00` resta per luci e bordi).
- **Fotosensibilità**: FlickerText e lampadina 404 hanno al massimo 2 picchi al secondo; un solo flash nell'intro.
- **FAQ**: accordion con `button`/`aria-expanded`/`aria-controls`, pannelli chiusi con `hidden="until-found"` (trovabili con Cerca nella pagina; evento `beforematch`), `<noscript>` li apre tutti. JSON-LD `FAQPage` su `/faq`.
- **Transizioni pagina**: `<ViewTransition>` di React (View Transitions API) con fallback GSAP dove l'API manca.
- **Form**: validazione locale, errori testuali collegati con `aria-describedby`, riepilogo in `aria-live`, focus sul primo errore, esito dimostrativo. Analytics: solo il tipo di lavoro, mai dati personali.
- **Open Graph**: immagine generata con `next/og` (nessuna foto).

## Skill

- Usata: `modern-web-guidance` (pattern Spotlight con mask + `@property`, accordion trovabile).
- Non presente nell'ambiente: `frontend-design` (sostituita dalla direzione di design del brief).
- Le altre skill del brief (design-system, ux-copy, searchfit-seo, accessibility-review, design-critique, code-review) non sono state invocate come skill: i relativi controlli sono stati fatti a mano e con script (title/description/canonical/robots/h1 per pagina, alt, contrasto, tastiera, Lighthouse). Da rilanciare se serve un audit formale.

## Verifica fatta

- `npm run build` e `npm run lint` senza errori; `check-alt` ok.
- Screenshot Playwright 390x844 e 1440x900 di tutte le pagine (`screenshots/`), tour della home in tema scuro e chiaro.
- Una sola `<h1>` per pagina; title ≤ 60 e description ≤ 155 caratteri; canonical e `noindex` attivi; 404 con status 404.
- Form: 5 errori segnalati, focus sul primo campo, esito positivo dopo la compilazione.
- `prefers-reduced-motion`: intro in dissolvenza, casa tutta accesa, nessun pin, Spotlight spento.
- **Lighthouse mobile (home)**: Accessibility 100, Best Practices 100, SEO 100 con `NEXT_PUBLIC_ALLOW_INDEXING=true` (66 in demo, perché `noindex` è voluto), CLS 0.
  **Performance 79–84, LCP simulato ~3,7 s: sotto l'obiettivo (≥ 90, < 2,5 s).** Lighthouse parte sempre con `sessionStorage` vuoto, quindi ogni run riproduce l'intro a tutto schermo, e il primo paint osservato slitta di 1,4–2,5 s.
  In Chrome reale (CPU 4x, prima visita con intro) l'LCP è l'h1 a ~400 ms.
  Se il punteggio Lighthouse è vincolante, le leve sono: un'intro più corta, oppure l'intro solo da desktop.
  Si può anche dividere il bundle GSAP (TBT 210–410 ms).
- Script di verifica: `scripts/lh-report.mjs` riassume un `lh.json` prodotto da Lighthouse. Lighthouse va lanciato con un Chrome già aperto sulla porta di debug: `--port=9333`.

Nessun deploy effettuato.
