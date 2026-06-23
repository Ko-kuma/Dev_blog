import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { getReadingTime } from "@/lib/reading-time";
import { slugify } from "@/lib/utils";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  thumbnail: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};

export type PostListItem = Omit<Post, "content">;

export type TagSummary = {
  name: string;
  slug: string;
  count: number;
};

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  return {
    title: String(data.title || slug),
    date: String(data.date || new Date().toISOString().slice(0, 10)),
    category: String(data.category || "기타"),
    tags: toStringArray(data.tags),
    description: String(data.description || ""),
    thumbnail: String(data.thumbnail || ""),
  };
}

function parsePostFile(raw: string) {
  if (!raw.startsWith("---")) {
    return {
      data: {},
      content: raw,
    };
  }

  const delimiter = /^---\s*$/gm;
  const opening = delimiter.exec(raw);
  const closing = delimiter.exec(raw);

  if (!opening || !closing) {
    return {
      data: {},
      content: raw,
    };
  }

  const yaml = raw.slice(opening.index + opening[0].length, closing.index).trim();
  const content = raw.slice(closing.index + closing[0].length).trimStart();
  const parsed = parseYaml(yaml);

  return {
    data: parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {},
    content,
  };
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parsePostFile(raw);
  const frontmatter = getFrontmatter(data, realSlug);

  return {
    slug: realSlug,
    content,
    readingTime: getReadingTime(content),
    ...frontmatter,
  };
}

export function getAllPosts(): PostListItem[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      category: post.category,
      tags: post.tags,
      description: post.description,
      thumbnail: post.thumbnail,
      readingTime: post.readingTime,
    }));
}

export function getAllTags(): TagSummary[] {
  const tagMap = new Map<string, TagSummary>();

  for (const post of getAllPosts()) {
    const uniqueTags = new Set(post.tags.map((tag) => tag.trim()).filter(Boolean));

    for (const tag of uniqueTags) {
      const slug = slugify(tag);

      if (!slug) {
        continue;
      }

      const current = tagMap.get(slug);

      tagMap.set(slug, {
        name: current?.name || tag,
        slug,
        count: (current?.count || 0) + 1,
      });
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByTagSlug(tagSlug: string) {
  return getAllPosts().filter((post) => post.tags.some((tag) => slugify(tag) === tagSlug));
}

export function getTagBySlug(tagSlug: string) {
  return getAllTags().find((tag) => tag.slug === tagSlug) || null;
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    previous: index >= 0 ? posts[index + 1] || null : null,
    next: index >= 0 ? posts[index - 1] || null : null,
  };
}
