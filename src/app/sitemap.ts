import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { blogPosts } from "@/lib/content/blog";
import { siteConfig } from "@/lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/client-projects",
    "/blog",
    "/get-quote",
  ];

  const serviceRoutes = services.map((s) => `/services/${s.slug}`);
  const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
