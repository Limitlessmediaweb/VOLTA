// Server statico per la pagina di composizione (video-tiktok/) sulla porta 4321.
// Le richieste /_next/* vengono girate al sito in produzione (SITE, default :3123): così la pagina
// usa gli stessi CSS, token e font next/font del sito, dalla stessa origine (niente problemi CORS).
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE = process.env.SITE || "http://localhost:3123";
const PORT = Number(process.env.PORT || 4321);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/_next/")) {
    const r = await fetch(SITE + url.pathname + url.search);
    res.writeHead(r.status, { "content-type": r.headers.get("content-type") || "application/octet-stream" });
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }
  const file = normalize(join(ROOT, decodeURIComponent(url.pathname === "/" ? "/spot/index.html" : url.pathname)));
  if (!file.startsWith(normalize(ROOT)) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`spot server http://localhost:${PORT}  (proxy ${SITE})`));
