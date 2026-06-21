import { Suspense } from "react";
import type { Metadata } from "next";
import { TagsExplorer } from "@/components/tags-explorer";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "태그",
  description: "태그별 글 목록을 검색하고 모아봅니다.",
};

export default function TagsPage() {
  const tags = getAllTags();
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">Tags</p>
        <h1 className="text-4xl font-black text-ink dark:text-paper">태그</h1>
        <p className="max-w-2xl text-ink/68 dark:text-paper/68">
          관심 있는 키워드로 글을 빠르게 좁혀봅니다.
        </p>
      </header>

      <Suspense fallback={<div className="h-32 rounded-lg border border-ink/10 bg-white/70 dark:border-white/10 dark:bg-white/[0.04]" />}>
        <TagsExplorer tags={tags} posts={posts} />
      </Suspense>
    </div>
  );
}
