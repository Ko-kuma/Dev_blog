import Link from "next/link";
import { Github, Rss } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/58 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/68 dark:text-paper/68 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} {siteConfig.name}. 기록은 작게, 꾸준히.</p>
        <div className="flex items-center gap-2">
          <Link
            href="/sitemap.xml"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-mint/18 hover:text-ink dark:hover:text-paper"
          >
            <Rss aria-hidden size={15} />
            Sitemap
          </Link>
          <a
            href="https://github.com"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-coral/18 hover:text-ink dark:hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <Github aria-hidden size={15} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
