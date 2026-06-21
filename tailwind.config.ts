import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      colors: {
        ink: "#22252d",
        paper: "#f7fbff",
        mint: "#7ad7c4",
        coral: "#ff8f7d",
        berry: "#b66cff",
      },
      boxShadow: {
        pixel: "4px 4px 0 0 rgba(34, 37, 45, 0.16)",
      },
      backgroundImage: {
        "pixel-grid":
          "linear-gradient(rgba(34,37,45,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,37,45,.055) 1px, transparent 1px)",
      },
    },
  },
  plugins: [typography],
};

export default config;
