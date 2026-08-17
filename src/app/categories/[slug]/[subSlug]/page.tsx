import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Tags } from "lucide-react";
import {
  getAllCategoryGroups,
  getCategoryGroupBySlug,
  getPostsBySubcategorySlug,
  getSubcategoryBySlug,
} from "@/lib/posts";
import { formatDate, slugify } from "@/lib/utils";

type SubcategoryPageProps = {
  params: Promise<{
    slug: string;
    subSlug: string;
  }>;
};

export function generateStaticParams() {
  return getAllCategoryGroups().flatMap((group) =>
    group.subcategories.map((subcategory) => ({
      slug: group.slug,
      subSlug: subcategory.slug,
    })),
  );
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSubSlug = decodeURIComponent(subSlug);
  const group = getCategoryGroupBySlug(decodedSlug);
  const subcategory = getSubcategoryBySlug(decodedSlug, decodedSubSlug);

  if (!group || !subcategory) {
    return {
      title: "서브 카테고리를 찾을 수 없습니다",
    };
  }

  return {
    title: `${subcategory.name} 목차`,
    description: `${group.name}의 ${subcategory.name} 게시글 목차입니다.`,
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subSlug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedSubSlug = decodeURIComponent(subSlug);
  const group = getCategoryGroupBySlug(decodedSlug);
  const subcategory = getSubcategoryBySlug(decodedSlug, decodedSubSlug);

  if (!group || !subcategory) {
    notFound();
  }

  const posts = getPostsBySubcategorySlug(group.slug, subcategory.slug);
  const groups = getAllCategoryGroups();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
          >
            <ArrowLeft aria-hidden size={16} />
            카테고리 목차
          </Link>
          <Link
            href={group.href}
            className="inline-flex items-center rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
          >
            {group.name}
          </Link>
        </div>
        <div className="space-y-2">
          <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">
            Subcategory
          </p>
          <h1 className="text-4xl font-black text-ink dark:text-paper">{subcategory.name}</h1>
          <p className="text-ink/68 dark:text-paper/68">
            {group.name} 아래 {subcategory.count}개의 글을 모았습니다.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav className="rounded-lg border border-ink/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="mb-2 px-2 font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">
              Index
            </p>
            <div className="space-y-2">
              {groups.map((item) => (
                <div key={item.slug}>
                  <Link
                    href={item.href}
                    className={
                      item.slug === group.slug
                        ? "flex items-center justify-between rounded-md bg-coral/12 px-2.5 py-2 text-sm font-bold text-coral dark:bg-mint/12 dark:text-mint"
                        : "flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-bold text-ink/72 transition hover:bg-coral/10 hover:text-ink dark:text-paper/72 dark:hover:bg-mint/10 dark:hover:text-paper"
                    }
                  >
                    <span>{item.name}</span>
                    <span className="font-mono text-xs opacity-70">{item.count}</span>
                  </Link>

                  {item.subcategories.length > 0 ? (
                    <div className="mt-1 space-y-1 pl-3">
                      {item.subcategories.map((child) => (
                        <Link
                          key={child.slug}
                          href={child.href}
                          className={
                            item.slug === group.slug && child.slug === subcategory.slug
                              ? "flex items-center justify-between rounded-md bg-coral/12 px-2.5 py-1.5 text-sm font-bold text-coral dark:bg-mint/12 dark:text-mint"
                              : "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm font-medium text-ink/58 transition hover:bg-coral/10 hover:text-ink dark:text-paper/58 dark:hover:bg-mint/10 dark:hover:text-paper"
                          }
                        >
                          <span>{child.name}</span>
                          <span className="font-mono text-xs opacity-70">{child.count}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </nav>
        </aside>

        <section>
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
