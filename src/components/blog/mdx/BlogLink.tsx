"use client";

import { LinkSimpleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "../hooks";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LinkPreview = { slug: string; title: string; description?: string };
export const LinkPreviewsContext = createContext<Record<string, LinkPreview>>({});

const INTERNAL_POST = /^\/blog\/([^/]+)\/?$/;
const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

function internalSlug(href?: string) {
  if (!href) return null;
  try {
    const u = new URL(href, SITE_URL);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== SITE_HOST && host !== "localhost") return null;
    const m = u.pathname.match(INTERNAL_POST);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

type AnchorProps = React.ComponentProps<"a"> & { href?: string };

function AnimatedLink({ href, className, children, ...rest }: AnchorProps) {
  return (
    <motion.a
      {...(rest as React.ComponentProps<typeof motion.a>)}
      href={href}
      className={cn(
        "inline-flex items-center gap-1 font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary",
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
      <LinkSimpleIcon className="h-4 w-4" weight="bold" />
    </motion.a>
  );
}

/** Internal blog link that previews the target post in a hover card (desktop only). */
function PreviewLink({ href, preview, className, children, ...rest }: AnchorProps & { preview: LinkPreview }) {
  const [open, setOpen] = useState(false);
  const [loadFrame, setLoadFrame] = useState(false);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const frameRef = useRef<HTMLIFrameElement>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) setLoadFrame(true);
    setOpen(next);
  };

  // Keep the card open while the pointer is inside the iframe document.
  useEffect(() => {
    if (!open || !loadFrame) return;
    const frame = frameRef.current;
    if (!frame) return;
    const keepOpen = () => handleOpenChange(true);
    const attach = () => frame.contentDocument?.documentElement.addEventListener("pointerenter", keepOpen);
    frame.addEventListener("load", attach);
    attach();
    return () => {
      frame.removeEventListener("load", attach);
      frame.contentDocument?.documentElement.removeEventListener("pointerenter", keepOpen);
    };
  }, [open, loadFrame]);

  if (!canHover) {
    return (
      <AnimatedLink href={href} className={className} {...rest}>
        {children}
      </AnimatedLink>
    );
  }

  return (
    <HoverCard open={open} onOpenChange={handleOpenChange} openDelay={180} closeDelay={400}>
      <HoverCardTrigger asChild>
        <AnimatedLink href={href} className={className} {...rest}>
          {children}
        </AnimatedLink>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        collisionPadding={16}
        className="z-[110] h-[min(22rem,55vh)] w-[min(24rem,calc(100vw-2rem))] overflow-hidden p-0"
      >
        {loadFrame ? (
          <iframe
            ref={frameRef}
            src={`/blog/${preview.slug}/embed`}
            title={preview.title}
            className="h-full w-full border-0 bg-background"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-muted" />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export function BlogLink({ href, className, children, ...rest }: AnchorProps) {
  const previews = useContext(LinkPreviewsContext);
  const slug = internalSlug(typeof href === "string" ? href : undefined);
  const preview = slug ? previews[slug] ?? null : null;

  if (preview && typeof href === "string") {
    return (
      <PreviewLink href={href} preview={preview} className={className} {...rest}>
        {children}
      </PreviewLink>
    );
  }

  const external = typeof href === "string" && /^https?:\/\//.test(href) && slug === null;
  return (
    <motion.a
      {...(rest as React.ComponentProps<typeof motion.a>)}
      className={cn(
        "inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:text-primary/80 hover:decoration-primary",
        className,
      )}
      href={href}
      target={rest.target ?? (external ? "_blank" : undefined)}
      rel={rest.rel ?? (external ? "noopener noreferrer" : undefined)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
      <LinkSimpleIcon className="h-4 w-4" weight="bold" />
    </motion.a>
  );
}
