import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MdxImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
};

function getNumber(value: number | string | undefined, fallback: number) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function MdxFigureImage({ src = "", alt = "", width, height, caption }: MdxImageProps) {
  const imageWidth = getNumber(width, 1200);
  const imageHeight = getNumber(height, 675);

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <Image
        src={src}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        sizes="(min-width: 1024px) 768px, 100vw"
        className="h-auto w-full object-cover"
      />
      {caption ? (
        <figcaption className="border-t border-ink/10 px-4 py-3 text-sm text-ink/58 dark:border-white/10 dark:text-paper/58">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function MdxPlainImage({ src = "", alt = "", width, height }: MdxImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={getNumber(width, 1200)}
      height={getNumber(height, 675)}
      sizes="(min-width: 1024px) 768px, 100vw"
      className="h-auto w-full rounded-lg border border-ink/10 dark:border-white/10"
    />
  );
}

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="font-semibold text-coral underline-offset-4 hover:underline dark:text-mint">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className="font-semibold text-coral underline-offset-4 hover:underline dark:text-mint"
      {...props}
    >
      {children}
    </a>
  );
}

function Callout({
  children,
  tone = "mint",
}: {
  children: ReactNode;
  tone?: "mint" | "coral";
}) {
  return (
    <aside
      className={cn(
        "my-6 rounded-lg border p-4 text-sm leading-6",
        tone === "mint"
          ? "border-mint/50 bg-mint/12 text-ink dark:text-paper"
          : "border-coral/50 bg-coral/12 text-ink dark:text-paper",
      )}
    >
      {children}
    </aside>
  );
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxPlainImage,
  Image: MdxFigureImage,
  Callout,
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={cn("scroll-mt-28", className)} {...props} />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("scroll-mt-28", className)} {...props} />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 className={cn("scroll-mt-28", className)} {...props} />
  ),
};
