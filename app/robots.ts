import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /clients is an unlisted page — not linked anywhere, kept out of search
      // until it's ready to launch.
      disallow: ["/admin/", "/clients"],
    },
  };
}
