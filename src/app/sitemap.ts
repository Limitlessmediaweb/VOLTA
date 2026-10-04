import type { MetadataRoute } from "next";
import { publicRoutes } from "@/data/nav";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path === "/privacy" || path === "/termini" ? 0.3 : 0.7,
  }));
}
