// Fallisce se trova <img> senza attributo alt nei sorgenti (src/) o nell'HTML generato (.next/server/app).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const roots = [["src", [".tsx", ".jsx", ".html"]], [".next/server/app", [".html"]]];
const offenders = [];

function walk(dir, exts) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts);
    else if (exts.includes(extname(p))) {
      const src = readFileSync(p, "utf8");
      for (const m of src.matchAll(/<img\b[^>]*>/gis)) {
        if (!/\balt\s*=/.test(m[0])) offenders.push(`${p}: ${m[0].slice(0, 80)}…`);
      }
    }
  }
}

for (const [dir, exts] of roots) if (existsSync(dir)) walk(dir, exts);

if (offenders.length) {
  console.error(`✗ ${offenders.length} <img> senza alt:\n` + offenders.join("\n"));
  process.exit(1);
}
console.log("✓ check-alt: nessun <img> senza alt");
