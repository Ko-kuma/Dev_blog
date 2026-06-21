"use client";

import Giscus from "@giscus/react";
import { MessageSquare } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function GiscusComments() {
  const { theme } = useTheme();
  const isConfigured = repo && repoId && category && categoryId;

  return (
    <section className="mt-12 rounded-lg border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-ink dark:text-paper">
        <MessageSquare aria-hidden size={20} />
        댓글
      </div>

      {isConfigured ? (
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={theme === "dark" ? "dark" : "light"}
          lang="ko"
          loading="lazy"
        />
      ) : (
        <p className="text-sm leading-6 text-ink/64 dark:text-paper/64">
          Giscus 환경변수를 채우면 GitHub Discussions 기반 댓글이 표시됩니다.
        </p>
      )}
    </section>
  );
}
