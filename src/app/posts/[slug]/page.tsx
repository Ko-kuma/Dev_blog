import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { GiscusComments } from "@/components/giscus-comments";
import { mdxComponents } from "@/components/mdx-components";
import { TableOfContents } from "@/components/table-of-contents";
import { mdxOptions } from "@/lib/mdx-options";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { getTableOfContents } from "@/lib/toc";
import { formatDate, slugify } from "@/lib/utils";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(decodeURIComponent(slug));

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다",
    };
  }

  const url = `/posts/${post.slug}`;
  const images = [post.thumbnail || "/images/og-default.svg"];

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
      publishedTime: post.date,
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  const toc = getTableOfContents(post.content);
  const { previous, next } = getAdjacentPosts(post.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <article>
        <header className="mb-8 space-y-5">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-bold text-ink/62 transition hover:bg-coral/12 hover:text-ink dark:text-paper/62 dark:hover:bg-mint/12 dark:hover:text-paper"
          >
            <ArrowLeft aria-hidden size={16} />
            전체 글
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink/60 dark:text-paper/60">
              <span className="rounded-md border border-coral/30 bg-coral/10 px-2 py-1 text-coral dark:border-mint/30 dark:bg-mint/10 dark:text-mint">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden size={15} />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 aria-hidden size={15} />
                읽는 시간 {post.readingTime}분
              </span>
            </div>

            <h1 className="text-balance text-4xl font-black leading-tight text-ink dark:text-paper sm:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-ink/70 dark:text-paper/70">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  className="rounded-md border border-ink/10 bg-white px-2.5 py-1.5 font-mono text-xs text-ink/64 transition hover:border-mint hover:bg-mint/12 hover:text-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/68 dark:hover:border-mint dark:hover:text-paper"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {post.thumbnail ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-ink/10 bg-mint/14 shadow-pixel dark:border-white/10">
              <Image
                src={post.thumbnail}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-ink prose-p:leading-8 prose-a:no-underline prose-strong:text-ink prose-li:leading-8 dark:prose-invert dark:prose-headings:text-paper dark:prose-strong:text-paper">
              <MDXRemote
                source={post.content}
                options={{ mdxOptions }}
                components={mdxComponents}
              />
            </div>

            <nav className="mt-12 grid gap-4 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/posts/${previous.slug}`}
                  className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-coral/50 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-mint/50"
                >
                  <span className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-ink/54 dark:text-paper/54">
                    <ArrowLeft aria-hidden size={15} />
                    이전 글
                  </span>
                  <p className="font-bold text-ink dark:text-paper">{previous.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/posts/${next.slug}`}
                  className="rounded-lg border border-ink/10 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-coral/50 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-mint/50"
                >
                  <span className="mb-2 inline-flex items-center justify-end gap-1.5 text-sm font-bold text-ink/54 dark:text-paper/54">
                    다음 글
                    <ArrowRight aria-hidden size={15} />
                  </span>
                  <p className="font-bold text-ink dark:text-paper">{next.title}</p>
                </Link>
              ) : null}
            </nav>

            <GiscusComments />
          </div>

          <aside>
            <TableOfContents items={toc} />
          </aside>
        </div>
      </article>
    </div>
  );
}
