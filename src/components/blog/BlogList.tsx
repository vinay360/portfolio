"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CalendarDotsIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

import { useMediaQuery } from "./hooks";

import { triggerHaptic } from "@/lib/haptics";
import { formatPostDate, getOgThumbUrl, type PostMeta } from "@/lib/blog";

const PREVIEW_W = 300;
const PREVIEW_H = 160;

function previewPosition(article: DOMRect, title: DOMRect, clientX: number) {
  const x = clientX - article.left;
  const y = title.top - article.top;
  const showAbove = title.top + 100 + PREVIEW_H > window.innerHeight;
  return {
    x: Math.max(
      8,
      Math.min(
        x + 20 + PREVIEW_W > article.width - 8 ? x - PREVIEW_W - 20 : x + 20,
        article.width - PREVIEW_W - 8,
      ),
    ),
    y: showAbove ? y - PREVIEW_H - 100 : y,
    showAbove,
  };
}

function BlogListItem({
  post,
  showCategories = false,
  enableHoverEffects = true,
}: {
  post: PostMeta;
  showCategories?: boolean;
  enableHoverEffects?: boolean;
}) {
  const { slug, frontmatter } = post;
  const { title, description, publish_date, categories = [], image } = frontmatter;

  const [previewOpen, setPreviewOpen] = useState(false);
  const canHover = useMediaQuery("(hover: hover) and (min-width: 1024px)") && enableHoverEffects;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [above, setAbove] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const updatePosition = (e: React.MouseEvent) => {
    if (!articleRef.current || !titleRef.current) return;
    const p = previewPosition(
      articleRef.current.getBoundingClientRect(),
      titleRef.current.getBoundingClientRect(),
      e.clientX,
    );
    setPos({ x: p.x, y: p.y });
    setAbove(p.showAbove);
  };

  const hoverHandlers =
    enableHoverEffects && canHover
      ? {
          onMouseEnter: (e: React.MouseEvent) => {
            if (!image) return;
            updatePosition(e);
            setPreviewOpen(true);
          },
          onMouseLeave: () => setPreviewOpen(false),
          onMouseMove: updatePosition,
        }
      : {};

  const date = formatPostDate(publish_date);

  return (
    <article ref={articleRef} className="group relative isolate py-4" {...hoverHandlers}>
      <Link
        href={`/blog/${slug}`}
        onClick={() => triggerHaptic("light")}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <motion.h3
            ref={titleRef}
            layoutId={`blog-title-${slug}`}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.5 }}
            className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors z-10"
          >
            {title}
          </motion.h3>
          <p className="line-clamp-2 text-sm text-secondary">{description}</p>
          {showCategories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
              {categories.length > 2 && (
                <span className="text-xs text-muted-foreground">+{categories.length - 2} more</span>
              )}
            </div>
          )}
          <time className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex" dateTime={publish_date}>
            <CalendarDotsIcon className="size-3.5" />
            {date}
          </time>
        </div>
        <div className="flex flex-row items-center justify-between gap-4 sm:contents">
          <time className="flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden" dateTime={publish_date}>
            <CalendarDotsIcon className="size-3.5" />
            {date}
          </time>
          <span className="inline-flex items-center gap-1.5 text-sm text-secondary group-hover:text-primary transition-colors shrink-0">
            Read more
            <ArrowRightIcon className="size-4" />
          </span>
        </div>
      </Link>
      {enableHoverEffects && image && canHover && (
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              className={`pointer-events-none absolute overflow-hidden rounded-xl shadow-2xl ring-1 ring-border/50 ${
                above ? "mb-25" : "mt-25"
              } ml-10`}
              style={{ left: pos.x, top: pos.y, zIndex: 99999, transform: "translateZ(0px)" }}
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={getOgThumbUrl(image)}
                alt={title}
                width={PREVIEW_W}
                height={PREVIEW_H}
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </article>
  );
}

export function BlogList({
  posts,
  className = "",
  showCategories = false,
  enableHoverEffects = true,
}: {
  posts: PostMeta[];
  className?: string;
  showCategories?: boolean;
  enableHoverEffects?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 text-center py-12 animate-in-up">
        <h2 className="text-2xl font-semibold">No blog posts found</h2>
        <p className="text-muted-foreground">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col blog-list ${enableHoverEffects ? "" : "blog-list--static"} ${className}`}>
      {posts.map((post, i) => (
        <div key={post.slug} className="blog-list-item" style={{ animationDelay: `${0.05 * i}s` }}>
          <BlogListItem post={post} showCategories={showCategories} enableHoverEffects={enableHoverEffects} />
        </div>
      ))}
    </div>
  );
}
