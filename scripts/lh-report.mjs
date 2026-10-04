// Riassume lh.json prodotto da Lighthouse.
import { readFileSync } from "node:fs";
const r = JSON.parse(readFileSync("./lh.json", "utf8"));
console.log(r.finalDisplayedUrl, Object.entries(r.categories).map(([k, c]) => `${k} ${Math.round(c.score * 100)}`).join(" | "));
const a = r.audits;
console.log(["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "first-contentful-paint", "speed-index"].map((id) => `${id}: ${a[id]?.displayValue}`).join(" | "));
for (const [id, x] of Object.entries(a))
  if (x.score !== null && x.score < 0.9 && !["informative", "notApplicable", "manual"].includes(x.scoreDisplayMode))
    console.log("  ✗", id, x.score, x.displayValue || "", JSON.stringify(x.details?.items?.slice(0, 4)?.map((i) => i.node?.snippet || i.url || "") || "").slice(0, 400));
