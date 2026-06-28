import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type VisitStore = {
  date: string;
  visitorIds: Set<string>;
};

type VisitGlobal = typeof globalThis & {
  __devBlogVisitStore?: VisitStore;
};

const visitorCookieName = "dev-log-visitor-id";
const lastVisitCookieName = "dev-log-last-visit-date";

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

function getVisitStore(date: string) {
  const visitGlobal = globalThis as VisitGlobal;

  if (!visitGlobal.__devBlogVisitStore || visitGlobal.__devBlogVisitStore.date !== date) {
    visitGlobal.__devBlogVisitStore = {
      date,
      visitorIds: new Set<string>(),
    };
  }

  return visitGlobal.__devBlogVisitStore;
}

export function GET(request: NextRequest) {
  const today = getTodayKey();
  const store = getVisitStore(today);
  const visitorId = request.cookies.get(visitorCookieName)?.value || crypto.randomUUID();
  const lastVisitDate = request.cookies.get(lastVisitCookieName)?.value;

  if (lastVisitDate !== today || !store.visitorIds.has(visitorId)) {
    store.visitorIds.add(visitorId);
  }

  const response = NextResponse.json(
    {
      date: today,
      count: store.visitorIds.size,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

  response.cookies.set(visitorCookieName, visitorId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set(lastVisitCookieName, today, {
    httpOnly: true,
    maxAge: 60 * 60 * 36,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
