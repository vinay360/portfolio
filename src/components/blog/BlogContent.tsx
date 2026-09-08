"use client";

import { CalendarDotsIcon, CheckIcon, CopyIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { blogHeadingFont } from "@/lib/fonts";
import { triggerHaptic, type HapticType } from "@/lib/haptics";
import { formatPostDate, type PostFrontmatter } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import { useClientValue } from "./hooks";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
  window.scrollTo({ top, behavior: "smooth" });
}

function HashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash);
  }, [pathname]);
  useEffect(() => {
    const onHash = () => window.location.hash && scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return null;
}

const hapticToast = {
  success: (msg: string) => {
    triggerHaptic("success");
    toast.success(msg);
  },
  error: (msg: string) => {
    triggerHaptic("error" as HapticType);
    toast.error(msg);
  },
};

/* ------------------------------------------------------------------ */
/* share dialog                                                       */
/* ------------------------------------------------------------------ */

function ShareDialog({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      hapticToast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      hapticToast.error("Failed to copy link");
    }
  };

  const shareTo = async (target: string) => {
    const text = `Hey!\n\nI read this post on ${SITE_NAME}'s site on ${title}. ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      hapticToast.success("Post content copied");
    } catch {
      hapticToast.error("Failed to copy");
    }
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) triggerHaptic("light");
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" asChild className="rounded-xl px-4 py-2 h-auto">
          <motion.div whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
            <span className="text-sm font-medium">Share</span>
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
          <DialogDescription>“{title}”</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Copy link</label>
            <div className="flex gap-2">
              <Input type="text" value={url} readOnly className="flex-1" />
              <Button onClick={copyLink} size="icon" variant="outline" disabled={copied}>
                {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Share on</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  shareTo(
                    `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out: ${title}`)}&url=${encodeURIComponent(url)}`,
                  )
                }
              >
                <XLogoIcon className="size-4" weight="fill" />
                Twitter / X
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => shareTo(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
              >
                <LinkedinLogoIcon className="size-4" weight="fill" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* header                                                             */
/* ------------------------------------------------------------------ */

const spring = { type: "spring" as const, stiffness: 400, damping: 35 };

function BlogHeader({ frontmatter, slug }: { frontmatter: PostFrontmatter; slug: string }) {
  const { title, description, publish_date } = frontmatter;
  const url = `${SITE_URL}/blog/${slug}`;
  // Animate the header in only when arriving from the blog list (shared layout).
  const fromList = useClientValue(() => {
    const ref = document.referrer;
    const origin = window.location.origin;
    return !!(ref && ref.startsWith(origin) && ref.includes("/blog") && !ref.includes(`/blog/${slug}`));
  }, false);

  const delay = (d: number) => (fromList ? d : 0);

  return (
    <header className="mb-8 space-y-4">
      <div className="space-y-4">
        <motion.h1
          layoutId={`blog-title-${slug}`}
          layout
          initial={fromList ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ layout: { ...spring, mass: 0.5 }, opacity: spring, y: spring }}
          className={`text-4xl font-bold leading-tight lg:text-5xl ${blogHeadingFont.className}`}
        >
          {title}
        </motion.h1>
        <motion.p
          layoutId={`blog-description-${slug}`}
          layout
          initial={fromList ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            layout: { ...spring, mass: 0.5 },
            opacity: { ...spring, delay: delay(0.1) },
            y: { ...spring, delay: delay(0.1) },
          }}
          className="text-xl text-muted-foreground"
        >
          {description}
        </motion.p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.div
            layoutId={`blog-date-${slug}`}
            layout
            initial={fromList ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              layout: { ...spring, mass: 0.5 },
              opacity: { ...spring, delay: delay(0.15) },
              y: { ...spring, delay: delay(0.15) },
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CalendarDotsIcon className="size-6" />
            <time dateTime={publish_date}>{formatPostDate(publish_date)}</time>
          </motion.div>
          <ShareDialog title={title} url={url} />
        </div>
      </div>
      <Separator />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* floating table of contents                                         */
/* ------------------------------------------------------------------ */

type Heading = { id: string; text: string; level: number };

function ProgressRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-white/30" strokeWidth="4" />
      <motion.circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        className="stroke-current text-white"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

function TableOfContents({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);
  const [widths, setWidths] = useState({ open: 400, closed: 280 });
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setWidths({ open: w - 32, closed: Math.min(280, w - 32) });
      else if (w < 768) setWidths({ open: Math.min(400, w - 48), closed: 280 });
      else setWidths({ open: 400, closed: 280 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const collect = () => {
      const root = contentRef.current;
      if (!root) return;
      const found: Heading[] = [];
      root.querySelectorAll("h2, h3").forEach((el) => {
        const text = el.textContent?.trim() ?? "";
        if (!text) return;
        let id = el.getAttribute("id");
        if (!id) {
          id = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
          el.setAttribute("id", id);
        }
        found.push({ id, text, level: Number(el.tagName.replace("H", "")) });
      });
      if (found.length) queueMicrotask(() => setHeadings(found));
    };
    collect();
    const t1 = setTimeout(collect, 400);
    const t2 = setTimeout(collect, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [contentRef]);

  useEffect(() => {
    if (!headings.length) return;
    queueMicrotask(() => setActiveId(headings[0].id));
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible.length) {
          const id = visible[0].target.getAttribute("id");
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
  }, []);

  if (!headings.length || typeof document === "undefined") return null;

  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const progress = headings.length > 0 ? ((activeIndex + 1) / headings.length) * 100 : 0;

  const jumpTo = (id: string) => {
    triggerHaptic("selection");
    setOpen(false);
    lockRef.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    setActiveId(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: "smooth" });
        lockTimer.current = setTimeout(() => {
          lockRef.current = false;
        }, 1200);
      } else {
        lockRef.current = false;
      }
    }, 50);
  };

  const node = (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              triggerHaptic("light");
              setOpen(false);
            }}
            className="fixed inset-0 z-[99] bg-black/10"
          />
        )}
      </AnimatePresence>
      <motion.nav
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-heading-item]")) return;
          triggerHaptic("light");
          setOpen((v) => !v);
        }}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { width: widths.open, borderRadius: 24 },
          closed: { width: widths.closed, borderRadius: 30 },
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer overflow-hidden bg-[#09090B] dark:bg-[#1a1a1a] shadow-2xl ring-1 ring-white/10 z-[100] max-w-[calc(100vw-2rem)] sm:max-w-none"
        style={{ height: open ? "auto" : "48px" }}
      >
        <div className={`relative w-full ${open ? "p-3" : "flex items-center justify-center h-full"}`}>
          {open && (
            <div className="flex flex-col h-full pb-12">
              <div className="mb-2 px-2 text-xs font-semibold text-white/40 uppercase tracking-wider shrink-0">
                Table of Contents
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 toc-scrollbar">
                <div className="flex flex-col gap-1">
                  {headings.map((h) => {
                    const active = activeId === h.id;
                    return (
                      <div
                        key={h.id}
                        data-heading-item
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          jumpTo(h.id);
                        }}
                        className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          active ? "bg-white/10" : "hover:bg-white/5"
                        } ${active ? "text-white" : h.level === 2 ? "text-white/60" : "text-white/40"} ${
                          active ? "" : "hover:text-white"
                        }`}
                        style={{ paddingLeft: h.level === 3 ? "1.5rem" : "0.75rem" }}
                      >
                        <span className="truncate min-w-0 flex-1">{h.text}</span>
                        {active && (
                          <motion.div layoutId="toc-active-dot" className="size-1.5 shrink-0 rounded-full bg-white ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div
            className={`flex w-full items-center justify-between gap-3 ${
              open ? "absolute bottom-0 left-0 border-t border-white/5 p-3" : "px-4"
            }`}
            style={{ height: open ? "50px" : "auto" }}
          >
            <div className="flex flex-1 items-center gap-3 overflow-hidden justify-center min-w-0">
              <div className="size-2 shrink-0 rounded-full bg-white" />
              <div className="relative h-5 flex-1 min-w-0 overflow-hidden">
                <motion.div
                  animate={{ y: -(20 * activeIndex) }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute left-0 top-0 w-full"
                >
                  {headings.map((h) => (
                    <div key={h.id} className="flex h-5 items-center text-[13px] font-medium text-white min-w-0">
                      <span className="truncate block w-full">{h.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
            <div className="relative size-7 shrink-0 mr-1">
              <ProgressRing progress={progress} />
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );

  return createPortal(node, document.body);
}

/* ------------------------------------------------------------------ */
/* wrapper                                                            */
/* ------------------------------------------------------------------ */

export function BlogContent({
  frontmatter,
  slug,
  children,
  showToc = true,
}: {
  frontmatter: PostFrontmatter;
  slug: string;
  children: React.ReactNode;
  showToc?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mx-auto ">
      <HashScroll />
      <article className="mx-auto max-w-4xl">
        <BlogHeader frontmatter={frontmatter} slug={slug} />
        <div ref={contentRef} className="prose prose-neutral max-w-none dark:prose-invert">
          {children}
        </div>
      </article>
      {showToc ? <TableOfContents contentRef={contentRef} /> : null}
    </div>
  );
}
