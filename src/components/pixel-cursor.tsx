"use client";

import { useEffect, useRef } from "react";

type CursorState = "idle" | "walk" | "click";

export function PixelCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");

    if (!media.matches) {
      return;
    }

    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const target = { x: -80, y: -80 };
    const current = { x: -80, y: -80 };
    let state: CursorState = "idle";
    let lastMove = performance.now();
    let rafId = 0;

    document.documentElement.classList.add("pixel-cursor-enabled");

    const setState = (nextState: CursorState) => {
      if (state !== nextState) {
        state = nextState;
        cursor.dataset.state = nextState;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lastMove = performance.now();
      setState("walk");
    };

    const onPointerDown = () => setState("click");
    const onPointerUp = () => setState("idle");

    const tick = (time: number) => {
      current.x += (target.x - current.x) * 0.38;
      current.y += (target.y - current.y) * 0.38;

      if (time - lastMove > 140 && state !== "click") {
        setState("idle");
      }

      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.classList.remove("pixel-cursor-enabled");
    };
  }, []);

  return <div ref={cursorRef} aria-hidden className="pixel-cursor" data-state="idle" />;
}
