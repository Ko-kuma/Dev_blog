import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[72vh] max-w-3xl place-items-center px-4 py-16 text-center sm:px-6">
      <div className="space-y-6">
        <Image
          src="/images/not-found-bear.svg"
          alt=""
          width={256}
          height={192}
          priority
          className="mx-auto h-auto w-56"
        />
        <div className="space-y-3">
          <p className="font-mono text-sm font-bold uppercase text-coral dark:text-mint">404</p>
          <h1 className="text-4xl font-black text-ink dark:text-paper">페이지를 찾을 수 없습니다</h1>
          <p className="text-ink/68 dark:text-paper/68">
            주소가 바뀌었거나 아직 작성되지 않은 글일 수 있습니다.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-paper shadow-pixel transition hover:-translate-y-0.5 dark:bg-paper dark:text-ink"
        >
          <Home aria-hidden size={17} />
          홈으로
        </Link>
      </div>
    </div>
  );
}
