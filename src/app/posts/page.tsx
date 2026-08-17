import Link from "next/link";
import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getAllCategories, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글",
  description: "MDX로 작성한 모든 글을 최신순으로 모아봅니다.",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const { category: selected } = await searchParams;

  const posts = selected
    ? allPosts.filter(
        (post) => post.category === selected || post.categoryGroup === selected || post.subcategory === selected,
      )
    : allPosts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">Posts</p>
        <h1 className="text-4xl font-black text-ink dark:text-paper">
          {selected || "전체 글"}
        </h1>
        <p className="max-w-2xl text-ink/68 dark:text-paper/68">
          공부 기록과 일상 메모를 최신순으로 정리했습니다.
        </p>
      </header>

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
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/posts?category=${encodeURIComponent(category.name)}`}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
              selected === category.name
                ? "border-coral bg-coral/10 text-coral dark:border-mint dark:bg-mint/10 dark:text-mint"
                : "border-ink/10 bg-paper text-ink/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/72"
            }`}
          >
            {category.name}
            <span className="rounded-sm bg-ink/8 px-1.5 py-0.5 font-mono text-xs text-ink/58 dark:bg-white/10 dark:text-paper/62">
              {category.count}
            </span>
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
        <p className="text-ink/50 dark:text-paper/50">아직 글이 없습니다.</p>
      )}
    </div>
  );
}
