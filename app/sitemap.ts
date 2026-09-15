import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { VERTICALS } from "@/lib/verticals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1),
    page("/design", 0.9),
    page("/pricing", 0.9),
    page("/products", 0.8),
    ...PRODUCTS.map((p) => page(`/products/${p.slug}`, 0.8)),
    page("/samples", 0.8),
    page("/talk", 0.7),
    page("/faq", 0.7),
    page("/gallery", 0.6),
    page("/about", 0.5, "monthly"),
    ...VERTICALS.map((v) => page(`/for/${v.slug}`, 0.6)),
    page("/privacy", 0.1, "yearly"),
    page("/terms", 0.1, "yearly"),
  ];
}
