"use client";

import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

type VisitPayload = {
  date: string;
  count: number;
};

export function DailyVisitorCount({ className }: { className?: string }) {
  const [visit, setVisit] = useState<VisitPayload | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/visits", {
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: VisitPayload | null) => {
        if (isMounted && data) {
          setVisit(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVisit(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span
      title="쿠키와 서버 메모리 기준의 간단한 오늘 방문자 수입니다."
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border border-ink/10 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-ink/62 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/62",
        className,
      )}
    >
      <UsersRound aria-hidden size={14} />
      오늘 방문 {visit ? `${visit.count}명` : "-"}
    </span>
  );
}
