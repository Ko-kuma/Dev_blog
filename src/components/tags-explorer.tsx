"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PostCard } from "@/components/post-card";
import type { PostListItem, TagSummary } from "@/lib/posts";

type TagsExplorerProps = {
  tags: TagSummary[];
  posts: PostListItem[];
};

export function TagsExplorer({ tags, posts }: TagsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";

    if (currentQuery === query) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, query, router, searchParams]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTags = useMemo(() => {
    if (!normalizedQuery) {
      return tags;
    }

    return tags.filter((tag) => tag.name.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, tags]);

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    );
  }, [normalizedQuery, posts]);

  return (
    <div className="space-y-8">
      <div className="relative max-w-2xl">
        <Search
          aria-hidden
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/42 dark:text-paper/42"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="태그 검색"
          className="h-12 w-full rounded-lg border border-ink/10 bg-white pl-10 pr-12 text-base text-ink outline-none transition placeholder:text-ink/36 focus:border-coral focus:ring-4 focus:ring-coral/12 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper dark:placeholder:text-paper/36 dark:focus:border-mint dark:focus:ring-mint/12"
        />
        {query ? (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition hover:bg-coral/12 hover:text-ink dark:text-paper/50 dark:hover:bg-mint/12 dark:hover:text-paper"
          >
            <X aria-hidden size={16} />
          </button>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink dark:text-paper">태그</h2>
        <div className="flex flex-wrap gap-2">
          {filteredTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 font-mono text-sm text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-mint hover:bg-mint/12 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper"
            >
              #{tag.name}
              <span className="rounded-sm bg-ink/8 px-1.5 py-0.5 text-xs text-ink/58 dark:bg-white/10 dark:text-paper/62">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink dark:text-paper">글</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
