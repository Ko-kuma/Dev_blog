import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = ["", "/posts", "/tags"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: `${siteConfig.url}/tags/${tag.slug}`,
    lastModified: new Date(),
  }));

  return [...baseRoutes, ...postRoutes, ...tagRoutes];
}
