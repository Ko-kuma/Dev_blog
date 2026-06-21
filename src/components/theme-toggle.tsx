"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={toggleTheme}
      className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-coral/60 hover:text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral dark:border-white/10 dark:bg-ink dark:text-paper dark:hover:border-mint/60 dark:hover:text-mint"
    >
      {isDark ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </button>
  );
}
