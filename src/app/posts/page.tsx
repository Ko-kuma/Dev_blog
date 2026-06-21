import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글",
  description: "MDX로 작성한 모든 글을 최신순으로 모아봅니다.",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">Posts</p>
        <h1 className="text-4xl font-black text-ink dark:text-paper">전체 글</h1>
        <p className="max-w-2xl text-ink/68 dark:text-paper/68">
          공부 기록과 일상 메모를 최신순으로 정리했습니다.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
