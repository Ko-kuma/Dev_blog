import Link from "next/link";
import { Briefcase, Github, Instagram, Rss } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/58 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/68 dark:text-paper/68 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. 외우지 못해도 다시 볼 수 있게,
            작고 꾸준히 기록하기.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/sitemap.xml"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-mint/18 hover:text-ink dark:hover:text-paper"
          >
            <Rss aria-hidden size={15} />
            Sitemap
          </Link>
          <a
            href="https://portfolo-blog.vercel.app/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-mint/18 hover:text-ink dark:hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <Briefcase aria-hidden size={15} />
            Portfolio
          </a>
          <a
            href="https://github.com"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-coral/18 hover:text-ink dark:hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <Github aria-hidden size={15} />
            GitHub
          </a>
          <a
            href="https://www.instagram.com/0rdinary_hz?igsh=MXgzZGVlZmIzZXlkdw%3D%3D&utm_source=qr"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-coral/18 hover:text-ink dark:hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram aria-hidden size={15} />
            Instagram
          </a>
          <a
            href="https://x.com/water5cup"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition hover:bg-coral/18 hover:text-ink dark:hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <span className="font-mono text-sm font-bold">X</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
