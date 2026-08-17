import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText, CalendarDays, FolderOpen, Layers3 } from "lucide-react";
import { getAllCategoryGroups } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "카테고리 목차",
  description: "카테고리와 서브 카테고리별로 정리한 게시글 목차입니다.",
};

export default function CategoriesPage() {
  const categoryGroups = getAllCategoryGroups();
  const totalPosts = categoryGroups.reduce((sum, category) => sum + category.count, 0);
  const totalSections = categoryGroups.reduce(
    (sum, category) => sum + Math.max(category.subcategories.length, 1),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">
          Categories
        </p>
        <h1 className="text-4xl font-black text-ink dark:text-paper">카테고리 목차</h1>
        <p className="max-w-2xl text-ink/68 dark:text-paper/68">
          부모 카테고리와 서브 카테고리 기준으로 글을 묶어, 필요한 기록을 빠르게 다시 찾을 수 있게 정리했습니다.
        </p>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">
            Groups
          </p>
          <p className="mt-2 text-2xl font-black text-ink dark:text-paper">{categoryGroups.length}개</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">
            Sections
          </p>
          <p className="mt-2 text-2xl font-black text-ink dark:text-paper">{totalSections}개</p>
        </div>
        <Link
          href="/posts"
          className="inline-flex items-center justify-between rounded-lg border border-ink/10 bg-white p-4 font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-coral/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper dark:hover:border-mint/50"
        >
          전체 글 {totalPosts}개
          <ArrowRight aria-hidden size={18} />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {categoryGroups.map((group) => {
          const hasSubcategories = group.subcategories.length > 0;
          const standalonePosts = group.posts.slice(0, 7);

          return (
            <section
              key={group.slug}
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/14 px-2.5 py-1.5 text-sm font-bold text-ink dark:text-paper">
                    <FolderOpen aria-hidden size={16} />
                    {group.name}
                  </div>
                  <p className="text-sm text-ink/58 dark:text-paper/58">{group.count}개의 글</p>
                </div>
                <Link
                  href={group.href}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
                >
                  전체
                  <ArrowRight aria-hidden size={15} />
                </Link>
              </div>

              {hasSubcategories ? (
                <div className="space-y-5">
                  {group.subcategories.map((subcategory) => (
                    <div key={subcategory.slug} className="border-t border-ink/10 pt-4 dark:border-white/10">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Link
                          href={subcategory.href}
                          className="inline-flex items-center gap-2 font-bold text-ink transition hover:text-coral dark:text-paper dark:hover:text-mint"
                        >
                          <Layers3 aria-hidden size={16} />
                          {subcategory.name}
                        </Link>
                        <span className="rounded-sm bg-ink/8 px-1.5 py-0.5 font-mono text-xs text-ink/58 dark:bg-white/10 dark:text-paper/62">
                          {subcategory.count}
                        </span>
                      </div>
                      <ol className="space-y-2">
                        {subcategory.posts.slice(0, 4).map((post, index) => (
                          <li key={post.slug}>
                            <Link
                              href={`/posts/${post.slug}`}
                              className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md px-2 py-2 transition hover:bg-coral/8 dark:hover:bg-mint/8"
                            >
                              <span className="font-mono text-sm font-bold text-ink/36 dark:text-paper/36">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate font-bold text-ink transition group-hover:text-coral dark:text-paper dark:group-hover:text-mint">
                                  {post.title}
                                </span>
                                <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink/52 dark:text-paper/52">
                                  <CalendarDays aria-hidden size={13} />
                                  {formatDate(post.date)}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ol>

                      {subcategory.count > 4 ? (
                        <Link
                          href={subcategory.href}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-coral transition hover:bg-coral/10 dark:text-mint dark:hover:bg-mint/10"
                        >
                          {subcategory.count - 4}개 더 보기
                          <BookOpenText aria-hidden size={15} />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <ol className="space-y-3">
                  {standalonePosts.map((post, index) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md border border-ink/8 bg-paper/70 p-3 transition hover:-translate-y-0.5 hover:border-coral/40 hover:bg-coral/8 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-mint/40 dark:hover:bg-mint/8"
                      >
                        <span className="font-mono text-sm font-bold text-ink/36 dark:text-paper/36">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-ink transition group-hover:text-coral dark:text-paper dark:group-hover:text-mint">
                            {post.title}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink/52 dark:text-paper/52">
                            <CalendarDays aria-hidden size={13} />
                            {formatDate(post.date)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
