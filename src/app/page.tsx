import Link from "next/link";
import { ArrowRight, FolderOpen, Sparkles, Tags } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { categoryGroups } from "@/lib/site";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 12);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/14 px-3 py-2 text-sm font-semibold text-ink dark:text-paper">
            <Sparkles aria-hidden size={16} />
            Next.js, MDX, 작은 기록들
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-black leading-tight text-ink dark:text-paper sm:text-5xl">
              공부와 일상을 차곡차곡 쌓는 개인 기술 블로그
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-ink/70 dark:text-paper/70">
              Front-End, Back-End, CS 공부 기록과 여행 메모를 MDX로 관리하고, 픽셀 감성의 작은 UI로 읽기 좋게 보여줍니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-paper shadow-pixel transition hover:-translate-y-0.5 dark:bg-paper dark:text-ink"
            >
              글 보기
              <ArrowRight aria-hidden size={17} />
            </Link>
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-coral/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper"
            >
              태그 보기
              <Tags aria-hidden size={17} />
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {latestPosts[0] ? <PostCard post={latestPosts[0]} /> : null}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-ink dark:text-paper">
            <FolderOpen aria-hidden size={20} />
            카테고리
          </div>
          <div className="space-y-5">
            {categoryGroups.map((group) => (
              <div key={group.name}>
                <p className="mb-2 text-sm font-bold text-ink/58 dark:text-paper/58">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-ink/10 bg-paper px-3 py-2 text-sm font-medium text-ink/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/72"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-ink dark:text-paper">최근 글</h2>
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-ink/68 transition hover:bg-coral/12 hover:text-ink dark:text-paper/68 dark:hover:bg-mint/12 dark:hover:text-paper"
            >
              전체
              <ArrowRight aria-hidden size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {latestPosts.slice(1).map((post) => (
              <PostCard key={post.slug} post={post} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-black text-ink dark:text-paper">태그</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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
    </div>
  );
}
