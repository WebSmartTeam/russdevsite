import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site-url";

// House rule: allow everything except /api/. Never block /_next/ or static assets.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absolute("/sitemap.xml"),
  };
}
