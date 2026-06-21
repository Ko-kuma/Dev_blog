import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTagSlug, getTagBySlug } from "@/lib/posts";

type TagPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(decodeURIComponent(slug));

  if (!tag) {
    return {
      title: "태그를 찾을 수 없습니다",
    };
  }

  return {
    title: `#${tag.name}`,
    description: `#${tag.name} 태그가 달린 글 목록입니다.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const tag = getTagBySlug(decodedSlug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTagSlug(decodedSlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-4">
        <Link
          href="/tags"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
        >
          <ArrowLeft aria-hidden size={16} />
          태그
        </Link>
        <div className="space-y-2">
          <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">Tag</p>
          <h1 className="text-4xl font-black text-ink dark:text-paper">#{tag.name}</h1>
          <p className="text-ink/68 dark:text-paper/68">{tag.count}개의 글</p>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
