import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { blogPosts } from "@/lib/content/blog";
import { portfolioDisciplines } from "@/lib/content/portfolio";
import { printProducts } from "@/lib/content/print";
import { siteConfig } from "@/lib/content/site";

// Static export has no server to generate these per-request, so pin
// them to build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/portfolio",
    "/print",
    "/white-label",
    "/client-projects",
    "/client-projects/platform",
    "/client-projects/website",
    "/blog",
    "/get-quote",
  ];

  const serviceRoutes = services.map((s) => `/services/${s.slug}`);
  const portfolioRoutes = portfolioDisciplines.map((p) => `/portfolio/${p.slug}`);
  const printRoutes = printProducts.map((p) => `/print/${p.slug}`);
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...printRoutes, ...blogRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
