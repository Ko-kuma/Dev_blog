import GithubSlugger from "github-slugger";

export type TocItem = {
  depth: 2 | 3 | 4;
  title: string;
  slug: string;
};

export function getTableOfContents(content: string) {
  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const depth = match[1].length as TocItem["depth"];
    const title = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/[`*_~[\]()]/g, "")
      .trim();

    if (title) {
      headings.push({
        depth,
        title,
        slug: slugger.slug(title),
      });
    }
  }

  return headings;
}
