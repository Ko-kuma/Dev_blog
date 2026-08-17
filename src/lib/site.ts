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
