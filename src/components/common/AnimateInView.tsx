"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  threshold?: number;
};

/** Fades/slides content up the first time it scrolls into view. */
export function AnimateInView({
  children,
  className,
  style,
  rootMargin = "0px 0px -40px 0px",
  threshold = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={cn("animate-in-up-on-view", inView && "in-view", className)} style={style}>
      {children}
    </div>
  );
}
