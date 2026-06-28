import Link from "next/link";
import { BookOpenText, Home, Tags } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/posts", label: "글", icon: BookOpenText },
  { href: "/tags", label: "태그", icon: Tags },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/86 backdrop-blur dark:border-white/10 dark:bg-ink/86">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-sm font-bold tracking-normal text-ink dark:text-paper"
          aria-label="Dev Log 홈"
        >
          <span className="grid size-8 place-items-center rounded-md border border-ink/15 bg-mint text-ink shadow-pixel transition group-hover:-translate-y-0.5 dark:border-white/15">
            D
          </span>
          <span>Dev Log</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-lg border border-ink/10 bg-white/78 p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink/72 transition hover:bg-coral/12 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral dark:text-paper/76 dark:hover:bg-mint/12 dark:hover:text-paper"
              >
                <Icon aria-hidden size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
