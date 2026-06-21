import type { CompileOptions } from "@mdx-js/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["heading-anchor"],
          ariaLabel: "해당 제목 링크",
        },
        content: {
          type: "element",
          tagName: "span",
          properties: {
            ariaHidden: "true",
          },
          children: [{ type: "text", value: "#" }],
        },
      },
    ],
    [
      rehypePrettyCode,
      {
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
        defaultLang: {
          block: "plaintext",
          inline: "plaintext",
        },
      },
    ],
  ],
} as CompileOptions;
