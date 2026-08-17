import type { MetadataRoute } from "next";
import { getAllCategoryGroups, getAllPosts, getAllTags } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = ["", "/posts", "/categories", "/tags"].map((route) => ({
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

  const categoryGroups = getAllCategoryGroups();

  const categoryRoutes = categoryGroups.map((category) => ({
    url: `${siteConfig.url}${category.href}`,
    lastModified: new Date(),
  }));

  const subcategoryRoutes = categoryGroups.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      url: `${siteConfig.url}${subcategory.href}`,
      lastModified: new Date(),
    })),
  );

  return [...baseRoutes, ...postRoutes, ...categoryRoutes, ...subcategoryRoutes, ...tagRoutes];
}
