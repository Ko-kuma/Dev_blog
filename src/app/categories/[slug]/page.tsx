import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, FolderOpen, Layers3, Tags } from "lucide-react";
import {
  getAllCategoryGroups,
  getCategoryGroupBySlug,
  getPostsByCategorySlug,
  type CategorySummary,
  type PostListItem,
} from "@/lib/posts";
import { formatDate, slugify } from "@/lib/utils";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllCategoryGroups().map((group) => ({
    slug: group.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const group = getCategoryGroupBySlug(decodedSlug);

  if (!group) {
    return {
      title: "카테고리를 찾을 수 없습니다",
    };
  }

  return {
    title: `${group.name} 목차`,
    description: `${group.name} 카테고리의 게시글 목차입니다.`,
  };
}

function CategorySidebar({
  currentGroupSlug,
  currentSubcategorySlug,
}: {
  currentGroupSlug?: string;
  currentSubcategorySlug?: string;
}) {
  const groups = getAllCategoryGroups();

  return (
    <nav className="rounded-lg border border-ink/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <p className="mb-2 px-2 font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">
        Index
      </p>
      <div className="space-y-2">
        {groups.map((group) => {
          const isCurrentGroup = group.slug === currentGroupSlug;

          return (
            <div key={group.slug}>
              <Link
                href={group.href}
                className={
                  isCurrentGroup && !currentSubcategorySlug
                    ? "flex items-center justify-between rounded-md bg-coral/12 px-2.5 py-2 text-sm font-bold text-coral dark:bg-mint/12 dark:text-mint"
                    : "flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-bold text-ink/72 transition hover:bg-coral/10 hover:text-ink dark:text-paper/72 dark:hover:bg-mint/10 dark:hover:text-paper"
                }
              >
                <span>{group.name}</span>
                <span className="font-mono text-xs opacity-70">{group.count}</span>
              </Link>

              {group.subcategories.length > 0 ? (
                <div className="mt-1 space-y-1 pl-3">
                  {group.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      href={subcategory.href}
                      className={
                        subcategory.slug === currentSubcategorySlug
                          ? "flex items-center justify-between rounded-md bg-coral/12 px-2.5 py-1.5 text-sm font-bold text-coral dark:bg-mint/12 dark:text-mint"
                          : "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm font-medium text-ink/58 transition hover:bg-coral/10 hover:text-ink dark:text-paper/58 dark:hover:bg-mint/10 dark:hover:text-paper"
                      }
                    >
                      <span>{subcategory.name}</span>
                      <span className="font-mono text-xs opacity-70">{subcategory.count}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function PostIndexList({ posts }: { posts: PostListItem[] }) {
  return (
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
  );
}

function SubcategorySection({ subcategory }: { subcategory: CategorySummary }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={subcategory.href}
          className="inline-flex items-center gap-2 text-2xl font-black text-ink transition hover:text-coral dark:text-paper dark:hover:text-mint"
        >
          <Layers3 aria-hidden size={20} />
          {subcategory.name}
        </Link>
        <span className="rounded-sm bg-ink/8 px-2 py-1 font-mono text-xs text-ink/58 dark:bg-white/10 dark:text-paper/62">
          {subcategory.count}개의 글
        </span>
      </div>
      <PostIndexList posts={subcategory.posts} />
    </section>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const group = getCategoryGroupBySlug(decodedSlug);

  if (!group) {
    notFound();
  }

  const posts = getPostsByCategorySlug(group.slug);

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
          <h1 className="text-4xl font-black text-ink dark:text-paper">{group.name}</h1>
          <p className="text-ink/68 dark:text-paper/68">
            {group.count}개의 글을 목차 형식으로 모았습니다.
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <CategorySidebar
            currentGroupSlug={group.slug}
          />
        </aside>

        <div className="space-y-10">
          {group.subcategories.length ? (
            group.subcategories.map((subcategory) => (
              <SubcategorySection key={subcategory.slug} subcategory={subcategory} />
            ))
          ) : (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xl font-black text-ink dark:text-paper">
                <FolderOpen aria-hidden size={20} />
                {group.name}
              </div>
              <PostIndexList posts={posts} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
