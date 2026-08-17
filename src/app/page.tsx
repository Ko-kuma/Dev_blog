import Link from "next/link";
import { ArrowRight, FolderOpen, Sparkles } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getAllCategoryGroups, getAllPosts, getAllTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 12);
  const categoryGroups = getAllCategoryGroups();
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/14 px-3 py-2 text-sm font-semibold text-ink dark:text-paper">
            <Sparkles aria-hidden size={16} />
            작은 배움의 아카이브
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-black leading-tight text-ink dark:text-paper sm:text-5xl">
              배움과 경험을 차곡차곡 모으는 공간
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-ink/70 dark:text-paper/70">
             프론트엔드와 백엔드, CS 공부 기록부터 프로젝트 경험과 일상 메모까지 정리합니다.
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
              href="/categories"
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-coral/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper"
            >
              목차 보기
              <FolderOpen aria-hidden size={17} />
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {latestPosts[0] ? <PostCard post={latestPosts[0]} /> : null}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-lg font-bold text-ink dark:text-paper">
              <FolderOpen aria-hidden size={20} />
              카테고리 목차
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
            >
              전체
              <ArrowRight aria-hidden size={15} />
            </Link>
          </div>
          <div className="space-y-5">
            {categoryGroups.map((group) => (
              <div key={group.slug}>
                <p className="mb-2 text-sm font-bold text-ink/58 dark:text-paper/58">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {(group.subcategories.length > 0 ? group.subcategories : [group]).map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-paper px-3 py-2 text-sm font-medium text-ink/72 transition hover:-translate-y-0.5 hover:border-mint hover:bg-mint/12 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/72"
                    >
                      {item.name}
                      <span className="rounded-sm bg-ink/8 px-1.5 py-0.5 font-mono text-xs text-ink/58 dark:bg-white/10 dark:text-paper/62">
                        {item.count}
                      </span>
                    </Link>
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
