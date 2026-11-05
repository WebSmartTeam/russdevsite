import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site-url";
import { LAST_UPDATED, SPECIMENS } from "@/lib/specimens";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = LAST_UPDATED;
  return [
    { url: absolute("/"), lastModified },
    ...SPECIMENS.map((s) => ({ url: absolute(s.href), lastModified })),
  ];
}
