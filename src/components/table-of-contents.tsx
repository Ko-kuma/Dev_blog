"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.slug || "");

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    for (const item of items) {
      const element = document.getElementById(item.slug);

      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="목차"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-auto rounded-lg border border-ink/10 bg-white/70 p-4 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] lg:block"
    >
      <p className="mb-3 font-mono text-xs font-bold uppercase text-ink/48 dark:text-paper/48">TOC</p>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={cn(
                "block border-l-2 py-1 leading-5 transition",
                item.depth === 3 && "pl-4",
                item.depth === 4 && "pl-7",
                item.depth === 2 && "pl-2",
                activeId === item.slug
                  ? "border-coral text-ink dark:border-mint dark:text-paper"
                  : "border-ink/12 text-ink/56 hover:border-coral/50 hover:text-ink dark:border-white/12 dark:text-paper/56 dark:hover:border-mint/50 dark:hover:text-paper",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
