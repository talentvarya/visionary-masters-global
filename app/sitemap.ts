import type { MetadataRoute } from "next";
import en from "@/locales/en.json";

const SITE_URL = "https://visionary-masters-global-tsgl.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    ...en.services.items.map((item) => ({
      url: `${SITE_URL}/services/${item.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];
}
