import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site";

// Static export has no server to generate these per-request, so pin
// them to build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
