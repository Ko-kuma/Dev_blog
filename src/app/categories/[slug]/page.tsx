import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Tags } from "lucide-react";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategorySlug,
} from "@/lib/posts";
import { formatDate, slugify } from "@/lib/utils";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(decodeURIComponent(slug));

  if (!category) {
    return {
      title: "카테고리를 찾을 수 없습니다",
    };
  }

  return {
    title: `${category.name} 목차`,
    description: `${category.name} 카테고리의 게시글 목차입니다.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = getCategoryBySlug(decodedSlug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategorySlug(decodedSlug);
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-4">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
        >
          <ArrowLeft aria-hidden size={16} />
          카테고리 목차
        </Link>
        <div className="space-y-2">
          <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">
            Category
          </p>
          <h1 className="text-4xl font-black text-ink dark:text-paper">{category.name}</h1>
          <p className="text-ink/68 dark:text-paper/68">
            {category.count}개의 글을 목차 형식으로 모았습니다.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav className="rounded-lg border border-ink/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="mb-2 px-2 font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">
              Index
            </p>
            <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/categories/${item.slug}`}
                  className={
                    item.slug === category.slug
                      ? "flex items-center justify-between rounded-md bg-coral/12 px-2.5 py-2 text-sm font-bold text-coral dark:bg-mint/12 dark:text-mint"
                      : "flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium text-ink/64 transition hover:bg-coral/10 hover:text-ink dark:text-paper/64 dark:hover:bg-mint/10 dark:hover:text-paper"
                  }
                >
                  <span>{item.name}</span>
                  <span className="font-mono text-xs opacity-70">{item.count}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <section className="space-y-3">
          <ol className="space-y-3">
            {posts.map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-coral/50 hover:shadow-pixel dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-mint/50 sm:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-lg font-black text-ink/28 dark:text-paper/28">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 space-y-2">
                    <span className="block text-xl font-black text-ink transition group-hover:text-coral dark:text-paper dark:group-hover:text-mint">
                      {post.title}
                    </span>
                    <span className="block text-sm leading-6 text-ink/64 dark:text-paper/64">
                      {post.description}
                    </span>
                    <span className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink/52 dark:text-paper/52">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays aria-hidden size={13} />
                        {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 aria-hidden size={13} />
                        읽는 시간 {post.readingTime}분
                      </span>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 font-mono">
                          <Tags aria-hidden size={12} />
                          #{slugify(tag) ? tag : "tag"}
                        </span>
                      ))}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
