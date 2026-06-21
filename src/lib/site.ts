export const siteConfig = {
  name: "Dev Log",
  title: "Dev Log - 개인 기술 블로그",
  description:
    "공부 기록과 일상, 여행을 함께 기록하는 Next.js 기반 개인 기술 블로그입니다.",
  author: "water",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  locale: "ko_KR",
};

export const categoryGroups = [
  {
    name: "공부 기록",
    items: ["Front-End", "Back-End", "CS", "기타"],
  },
  {
    name: "일상 및 여행",
    items: ["일상 및 여행"],
  },
] as const;
