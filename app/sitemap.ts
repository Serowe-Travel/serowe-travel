import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPublishedPackages } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/destinations",
    "/packages",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const packages = await getPublishedPackages();
  const packageRoutes = packages.map((p) => ({
    url: `${base}/packages/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...packageRoutes];
}
