import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { PostListItem } from "@/lib/posts";
import { cn, formatDate, slugify } from "@/lib/utils";

type PostCardProps = {
  post: PostListItem;
  compact?: boolean;
};

export function PostCard({ post, compact = false }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-coral/50 hover:shadow-pixel dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-mint/50">
      {!compact ? (
        <Link href={`/posts/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-mint/18">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full bg-pixel-grid bg-[length:14px_14px]" />
          )}
        </Link>
      ) : null}

      <div className={cn("space-y-4", compact ? "p-4" : "p-5")}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink/62 dark:text-paper/62">
          <span className="rounded-md border border-coral/30 bg-coral/10 px-2 py-1 text-coral dark:border-mint/30 dark:bg-mint/10 dark:text-mint">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden size={14} />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden size={14} />
            읽는 시간 {post.readingTime}분
          </span>
        </div>

        <div className="space-y-2">
          <Link href={`/posts/${post.slug}`} className="group/title inline-flex items-start gap-1.5">
            <h2 className="text-balance text-xl font-bold leading-snug text-ink transition group-hover/title:text-coral dark:text-paper dark:group-hover/title:text-mint">
              {post.title}
            </h2>
            <ArrowUpRight
              aria-hidden
              size={17}
              className="mt-1 shrink-0 opacity-0 transition group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:opacity-100"
            />
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-ink/70 dark:text-paper/70">
            {post.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="rounded-md border border-ink/10 px-2 py-1 font-mono text-xs text-ink/64 transition hover:border-mint hover:bg-mint/12 hover:text-ink dark:border-white/10 dark:text-paper/68 dark:hover:border-mint dark:hover:text-paper"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
