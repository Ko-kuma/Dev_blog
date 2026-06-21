import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "글",
  description: "MDX로 작성한 모든 글을 최신순으로 모아봅니다.",
};

const CATEGORIES = ["Front-End", "Back-End", "CS", "기타", "일상 및 여행"];

export default function PostsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = getAllPosts();
  const selected = searchParams.category;

  const posts = selected
    ? allPosts.filter((p) => p.category === selected)
    : allPosts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">Posts</p>
        <h1 className="text-4xl font-black text-ink dark:text-paper">전체 글</h1>
        <p className="max-w-2xl text-ink/68 dark:text-paper/68">
          공부 기록과 일상 메모를 최신순으로 정리했습니다.
        </p>
      </header>

      {/* 카테고리 필터 */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/posts"
          className={`rounded-md border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
            !selected
              ? "border-coral bg-coral/10 text-coral dark:border-mint dark:bg-mint/10 dark:text-mint"
              : "border-ink/10 bg-paper text-ink/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/72"
          }`}
        >
          전체
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/posts?category=${encodeURIComponent(cat)}`}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
              selected === cat
                ? "border-coral bg-coral/10 text-coral dark:border-mint dark:bg-mint/10 dark:text-mint"
                : "border-ink/10 bg-paper text-ink/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/72"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-ink/50 dark:text-paper/50">아직 글이 없어요.</p>
      )}
    </div>
  );
}