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
  subcategory?: string;
  tags: string[];
  description: string;
  thumbnail: string;
};

export type CategoryPath = {
  categoryGroup: string;
  categoryGroupSlug: string;
  subcategory?: string;
  subcategorySlug?: string;
};

export type Post = PostFrontmatter & CategoryPath & {
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

export type CategorySummary = {
  name: string;
  slug: string;
  count: number;
  posts: PostListItem[];
  parent?: {
    name: string;
    slug: string;
  };
  href: string;
};

export type CategoryGroupSummary = {
  name: string;
  slug: string;
  count: number;
  posts: PostListItem[];
  subcategories: CategorySummary[];
  href: string;
};

const CATEGORY_GROUP_ORDER = ["공부 기록", "일상 및 여행"];
const SUBCATEGORY_ORDER = ["Front-End", "Back-End", "CS", "Jump_To_Python", "기타"];

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
  const subcategory = String(data.subcategory || "").trim();

  return {
    title: String(data.title || slug),
    date: String(data.date || new Date().toISOString().slice(0, 10)),
    category: String(data.category || "기타"),
    ...(subcategory ? { subcategory } : {}),
    tags: toStringArray(data.tags),
    description: String(data.description || ""),
    thumbnail: String(data.thumbnail || ""),
  };
}

function resolveCategoryPath(frontmatter: Pick<PostFrontmatter, "category" | "subcategory">): CategoryPath {
  const category = frontmatter.category.trim() || "기타";
  const explicitSubcategory = frontmatter.subcategory?.trim();

  if (explicitSubcategory) {
    return {
      categoryGroup: category,
      categoryGroupSlug: slugify(category),
      subcategory: explicitSubcategory,
      subcategorySlug: slugify(explicitSubcategory),
    };
  }

  return {
    categoryGroup: category,
    categoryGroupSlug: slugify(category),
  };
}

export function getPostCategoryLabel(post: Pick<PostFrontmatter, "category" | "subcategory">) {
  return post.subcategory || post.category;
}

function sortByPreferredOrder<T extends { name: string }>(items: T[], preferredOrder: string[]) {
  return [...items].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.name);
    const bIndex = preferredOrder.indexOf(b.name);

    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    }

    return a.name.localeCompare(b.name);
  });
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

  const result: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith(".mdx")) {
        result.push(entry.name.replace(/\.mdx$/, ""));
      }
    }
  }

  walk(postsDirectory);
  return result;
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, "");

  function findFile(dir: string): string | null {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const found = findFile(path.join(dir, entry.name));
        if (found) return found;
      } else if (entry.name === `${realSlug}.mdx`) {
        return path.join(dir, entry.name);
      }
    }
    return null;
  }

  const fullPath = findFile(postsDirectory);
  if (!fullPath) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parsePostFile(raw);
  const frontmatter = getFrontmatter(data, realSlug);
  const categoryPath = resolveCategoryPath(frontmatter);

  return {
    slug: realSlug,
    content,
    readingTime: getReadingTime(content),
    ...categoryPath,
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
      subcategory: post.subcategory,
      categoryGroup: post.categoryGroup,
      categoryGroupSlug: post.categoryGroupSlug,
      subcategorySlug: post.subcategorySlug,
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

export function getAllCategoryGroups(): CategoryGroupSummary[] {
  type MutableCategoryGroup = Omit<CategoryGroupSummary, "subcategories"> & {
    subcategoryMap: Map<string, CategorySummary>;
  };

  const groupMap = new Map<string, MutableCategoryGroup>();

  for (const post of getAllPosts()) {
    if (!post.categoryGroupSlug) {
      continue;
    }

    const currentGroup = groupMap.get(post.categoryGroupSlug);
    const group: MutableCategoryGroup = currentGroup || {
      name: post.categoryGroup,
      slug: post.categoryGroupSlug,
      count: 0,
      posts: [],
      href: `/categories/${post.categoryGroupSlug}`,
      subcategoryMap: new Map<string, CategorySummary>(),
    };

    group.count += 1;
    group.posts.push(post);

    if (post.subcategory && post.subcategorySlug) {
      const currentSubcategory = group.subcategoryMap.get(post.subcategorySlug);

      group.subcategoryMap.set(post.subcategorySlug, {
        name: currentSubcategory?.name || post.subcategory,
        slug: post.subcategorySlug,
        count: (currentSubcategory?.count || 0) + 1,
        posts: [...(currentSubcategory?.posts || []), post],
        parent: {
          name: group.name,
          slug: group.slug,
        },
        href: `/categories/${group.slug}/${post.subcategorySlug}`,
      });
    }

    groupMap.set(group.slug, group);
  }

  return sortByPreferredOrder(
    Array.from(groupMap.values()).map(({ subcategoryMap, ...group }) => ({
      ...group,
      subcategories: sortByPreferredOrder(Array.from(subcategoryMap.values()), SUBCATEGORY_ORDER),
    })),
    CATEGORY_GROUP_ORDER,
  );
}

export function getAllCategories(): CategorySummary[] {
  return getAllCategoryGroups().flatMap((group) => {
    if (group.subcategories.length > 0) {
      return group.subcategories;
    }

    return [
      {
        name: group.name,
        slug: group.slug,
        count: group.count,
        posts: group.posts,
        href: group.href,
      },
    ];
  });
}

export function getPostsByTagSlug(tagSlug: string) {
  return getAllPosts().filter((post) => post.tags.some((tag) => slugify(tag) === tagSlug));
}

export function getTagBySlug(tagSlug: string) {
  return getAllTags().find((tag) => tag.slug === tagSlug) || null;
}

export function getPostsByCategorySlug(categorySlug: string) {
  return getAllPosts().filter((post) => post.categoryGroupSlug === categorySlug);
}

export function getCategoryBySlug(categorySlug: string) {
  return getCategoryGroupBySlug(categorySlug) || getAllCategories().find((category) => category.slug === categorySlug) || null;
}

export function getCategoryGroupBySlug(categorySlug: string) {
  return getAllCategoryGroups().find((category) => category.slug === categorySlug) || null;
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  return getCategoryGroupBySlug(categorySlug)?.subcategories.find((subcategory) => subcategory.slug === subcategorySlug) || null;
}

export function getPostsBySubcategorySlug(categorySlug: string, subcategorySlug: string) {
  return getAllPosts().filter((post) => post.categoryGroupSlug === categorySlug && post.subcategorySlug === subcategorySlug);
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    previous: index >= 0 ? posts[index + 1] || null : null,
    next: index >= 0 ? posts[index - 1] || null : null,
  };
}
