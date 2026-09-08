import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

const staticRoutes = [
  "",
  "/work",
  "/blog",
  "/resume",
  "/projects",
  "/gears",
  "/setup",
  "/terminal",
  "/books",
  "/movies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.publish_date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
