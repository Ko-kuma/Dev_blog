# Dev Log

Next.js 15 App Router, TypeScript, Tailwind CSS, MDX로 만든 개인 기술 블로그입니다. 글은 `content/posts/*.mdx` 파일로 관리하고, GitHub에 push하면 Vercel에서 자동 배포하는 흐름을 기준으로 구성했습니다.

## 기술 스택

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- MDX
- Shiki 기반 코드 하이라이팅 (`rehype-pretty-code`)
- Cloudinary 이미지 URL
- Giscus 댓글

## 폴더 구조

```txt
.
├─ content/
│  └─ posts/                # MDX 게시글
├─ public/
│  ├─ cursor/               # 픽셀 곰 커서 스프라이트
│  └─ images/               # OG, 404 이미지
├─ src/
│  ├─ app/                  # App Router 페이지, SEO 라우트
│  ├─ components/           # UI, TOC, Giscus, 커서
│  └─ lib/                  # 게시글 로더, MDX 옵션, 유틸
├─ next.config.ts
├─ tailwind.config.ts
├─ .env.local.example
└─ package.json
```

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다. 환경변수가 없어도 기본 글 목록, 태그, 다크모드, TOC, 코드 하이라이팅은 동작합니다.

## 글 작성

새 글은 `content/posts/my-post.mdx`처럼 추가합니다.

```md
---
title: "Next.js 블로그 만들기"
date: "2026-06-21"
category: "Front-End"
tags: ["Nextjs", "React"]
description: "개인 블로그 제작 기록"
thumbnail: "https://res.cloudinary.com/..."
---

## 제목

본문을 MDX로 작성합니다.
```

`category`는 `Front-End`, `Back-End`, `CS`, `기타`, `일상 및 여행` 중에서 사용하면 현재 구조와 잘 맞습니다. `tags`는 여러 개를 넣을 수 있고 `/tags`, `/tags/[slug]` 페이지에 자동 반영됩니다.

## 이미지

Cloudinary에 이미지를 업로드한 뒤 생성된 URL을 frontmatter의 `thumbnail` 또는 MDX 본문에 넣습니다.

```mdx
<Image
  src="https://res.cloudinary.com/..."
  alt="example"
  caption="이미지 설명"
/>
```

## 댓글

GitHub Discussions를 켠 뒤 [giscus.app](https://giscus.app)에서 저장소를 연결하고 `.env.local`에 값을 입력합니다.

```bash
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

## 배포

1. GitHub에 새 저장소를 만들고 이 프로젝트를 push합니다.
2. Vercel에서 해당 저장소를 import합니다.
3. 필요한 환경변수를 Vercel Project Settings > Environment Variables에 추가합니다.
4. `main` 브랜치에 push하면 Vercel이 자동으로 빌드 및 배포합니다.

## 주요 기능

- MDX 게시글 정적 생성
- 태그 목록, 태그 상세, `/tags?q=react` 검색 상태 유지
- 라이트/다크 모드 localStorage 저장
- 픽셀 곰 커서 CSS sprite 애니메이션
- h2, h3, h4 기반 TOC와 현재 위치 하이라이트
- 읽는 시간 자동 계산
- 이전 글, 다음 글 이동
- Giscus 댓글 다크모드 연동
- `sitemap.xml`, `robots.txt`, Open Graph, Twitter Card
