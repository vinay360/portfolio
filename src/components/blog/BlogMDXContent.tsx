"use client";

import { MDXRemote, type MDXRemoteProps } from "./mdx/runtime";
import { motion } from "motion/react";
import React from "react";

import { SocialMedia } from "@/components/common/SocialMedia";
import { blogHeadingFont, codeFont } from "@/lib/fonts";
import type { PostContent } from "@/lib/blog";

import { BlogLink, LinkPreviewsContext } from "./mdx/BlogLink";
import { CopyCodeButton } from "./mdx/CodeBlock";
import { Excalidraw } from "./mdx/Excalidraw";
import { Mermaid } from "./mdx/Mermaid";
import { MdxImage, Picture } from "./mdx/Picture";
import { MdxQuote } from "./mdx/Quote";
import { InstagramCard, TwitterCard, WinterCards } from "./mdx/SocialCards";
import { MdxTable } from "./mdx/Table";
import { Todo } from "./mdx/Todo";

const inView = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const inViewLarge = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

function textOf(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function languageFromClass(className?: unknown) {
  if (typeof className !== "string") return null;
  const m = className.match(/language-([\w-]+)/i);
  return m?.[1]?.toLowerCase() ?? null;
}

function languageFromChildren(node: React.ReactNode): string | null {
  if (Array.isArray(node)) {
    for (const n of node) {
      const l = languageFromChildren(n);
      if (l) return l;
    }
    return null;
  }
  if (!React.isValidElement<{ className?: string; "data-language"?: string; children?: React.ReactNode }>(node)) {
    return null;
  }
  const p = node.props;
  return (
    languageFromClass(p.className) ||
    (typeof p["data-language"] === "string" ? p["data-language"].toLowerCase() : languageFromChildren(p.children))
  );
}

function slugify(id: unknown, children: React.ReactNode) {
  if (typeof id === "string" && id.length) return id;
  return (
    textOf(children)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || undefined
  );
}

const MERMAID_PREFIXES = [
  "graph td",
  "graph tb",
  "graph lr",
  "graph bt",
  "graph rl",
  "flowchart",
  "sequencediagram",
  "classdiagram",
  "statediagram",
  "statediagram-v2",
  "erdiagram",
  "journey",
  "gantt",
  "pie",
  "requirementdiagram",
  "gitgraph",
  "mindmap",
  "timeline",
  "quadrantchart",
  "sankey-beta",
  "xychart-beta",
  "block-beta",
  "architecture-beta",
  "subgraph",
];

function NotProse({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={["not-prose", className].filter(Boolean).join(" ")}>{children}</div>;
}

type HeadingProps = React.ComponentProps<"h1"> & { children?: React.ReactNode };

function heading(
  Tag: "h1" | "h2" | "h3" | "h4",
  classes: string,
): React.ComponentType<HeadingProps> {
  const Heading = ({ children, id, style, ...rest }: HeadingProps) => (
    <motion.div {...inView}>
      <Tag
        id={slugify(id, children)}
        className={`${classes} ${blogHeadingFont.className}`}
        style={{ scrollMarginTop: "120px", ...style }}
        {...rest}
      >
        {children}
      </Tag>
    </motion.div>
  );
  Heading.displayName = `Mdx${Tag.toUpperCase()}`;
  return Heading;
}

const components = {
  img: ({ src, alt, ...rest }: React.ComponentProps<"img">) => (
    <MdxImage
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={800}
      height={200}
      className="rounded-lg max-h-92 w-auto justify-self-center"
      {...(rest as Record<string, unknown>)}
    />
  ),
  h1: heading(
    "h1",
    "group relative mb-6 text-4xl font-bold sm:hover:before:content-['#'] sm:hover:before:absolute sm:hover:before:-left-6 sm:hover:before:text-muted-foreground transition-all duration-300",
  ),
  h2: heading(
    "h2",
    "group relative mb-4 mt-8 text-3xl font-semibold sm:hover:before:content-['##'] sm:hover:before:absolute sm:hover:before:-left-12 sm:hover:before:text-muted-foreground transition-all duration-300",
  ),
  h3: heading(
    "h3",
    "group relative mb-3 mt-6 text-2xl font-medium sm:hover:before:content-['###'] sm:hover:before:absolute sm:hover:before:-left-16 sm:hover:before:text-muted-foreground transition-all duration-300",
  ),
  h4: heading(
    "h4",
    "group relative mb-3 mt-5 text-xl font-medium sm:hover:before:content-['####'] sm:hover:before:absolute sm:hover:before:-left-20 sm:hover:before:text-muted-foreground transition-all duration-300",
  ),
  p: ({ children, ...rest }: React.ComponentProps<"p">) => (
    <motion.div
      className="mb-4 leading-7 text-muted-foreground"
      {...inView}
      {...(rest as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  ),
  ul: ({ children, ...rest }: React.ComponentProps<"ul">) => (
    <motion.ul
      className="mb-4 ml-6 list-disc space-y-2"
      {...inView}
      {...(rest as React.ComponentProps<typeof motion.ul>)}
    >
      {children}
    </motion.ul>
  ),
  ol: ({ children, ...rest }: React.ComponentProps<"ol">) => (
    <motion.ol
      className="mb-4 ml-6 list-decimal space-y-2"
      {...inView}
      {...(rest as React.ComponentProps<typeof motion.ol>)}
    >
      {children}
    </motion.ol>
  ),
  li: ({ children, ...rest }: React.ComponentProps<"li">) => (
    <li className="leading-7 text-muted-foreground" {...rest}>
      {children}
    </li>
  ),
  pre: ({ children, className, ...rest }: React.ComponentProps<"pre">) => {
    const code = textOf(children);
    const lang = languageFromClass(className) ?? languageFromChildren(children);
    const lower = code.trim().toLowerCase();
    const isMermaid = lang === "mermaid" || (!lang && MERMAID_PREFIXES.some((p) => lower.startsWith(p)));
    if (isMermaid) return <Mermaid code={code} />;
    return (
      <motion.div className="group relative mb-4 min-w-0 max-w-full" {...inViewLarge}>
        <div
          className="relative flex min-w-0 max-w-full flex-col rounded-2xl bg-muted/50 p-1 border border-border *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1 my-6 not-prose"
          data-slot="frame"
        >
          <div
            className="relative min-w-0 max-w-full overflow-x-auto rounded-xl border bg-[oklch(0.205_0_0)] bg-clip-padding shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)] p-0 pl-4 py-2"
            data-slot="frame-panel"
          >
            <pre
              className={`m-0 min-w-0 w-full max-w-full overflow-x-auto whitespace-pre py-4 pr-4 pl-6 text-sm text-foreground [&>code]:block [&>code]:w-max [&>code]:min-w-0 [&>code]:bg-transparent [&>code]:p-0 ${codeFont.className}`}
              style={{ background: "transparent" }}
              {...rest}
            >
              {children}
            </pre>
          </div>
        </div>
        <CopyCodeButton code={code} />
      </motion.div>
    );
  },
  code: ({ children, className, ...rest }: React.ComponentProps<"code">) =>
    className?.includes("language-") ? (
      <code className={className} {...rest}>
        {children}
      </code>
    ) : (
      <code className="rounded py-1 text-sm font-mono" {...rest}>
        {children}
      </code>
    ),
  a: BlogLink,
  blockquote: ({ children, ...rest }: React.ComponentProps<"blockquote">) => (
    <motion.blockquote
      className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...inView}
      {...(rest as React.ComponentProps<typeof motion.blockquote>)}
    >
      {children}
    </motion.blockquote>
  ),
  Twitter: ({ url, ...rest }: { url: string; className?: string }) => (
    <NotProse>
      <motion.div {...inViewLarge}>
        <TwitterCard url={url} {...rest} />
      </motion.div>
    </NotProse>
  ),
  Instagram: ({ url, ...rest }: { url: string; className?: string }) => (
    <NotProse>
      <motion.div {...inViewLarge}>
        <InstagramCard url={url} {...rest} />
      </motion.div>
    </NotProse>
  ),
  Winter: ({ x, instagram, ...rest }: { x?: string; instagram?: string; className?: string }) => (
    <NotProse>
      <motion.div {...inViewLarge}>
        <WinterCards x={x} instagram={instagram} {...rest} />
      </motion.div>
    </NotProse>
  ),
  SocialMedia: (props: React.ComponentProps<typeof SocialMedia>) => (
    <NotProse>
      <SocialMedia {...props} />
    </NotProse>
  ),
  Picture: (props: React.ComponentProps<typeof Picture>) => (
    <NotProse>
      <Picture {...props} />
    </NotProse>
  ),
  Table: (props: React.ComponentProps<typeof MdxTable>) => (
    <NotProse>
      <MdxTable {...props} />
    </NotProse>
  ),
  Quote: (props: React.ComponentProps<typeof MdxQuote>) => (
    <NotProse>
      <MdxQuote {...props} />
    </NotProse>
  ),
  Todo: (props: React.ComponentProps<typeof Todo>) => (
    <NotProse>
      <Todo {...props} />
    </NotProse>
  ),
  Mermaid: (props: React.ComponentProps<typeof Mermaid>) => (
    <NotProse>
      <Mermaid {...props} />
    </NotProse>
  ),
  Excalidraw: (props: React.ComponentProps<typeof Excalidraw>) => (
    <NotProse>
      <Excalidraw {...props} />
    </NotProse>
  ),
} as unknown as MDXRemoteProps["components"];

export function BlogMDXContent({
  serializedContent,
  linkPreviews = {},
}: {
  serializedContent: { compiledSource: string; frontmatter?: Record<string, unknown>; scope?: Record<string, unknown> };
  linkPreviews?: PostContent["linkPreviews"];
}) {
  return (
    <LinkPreviewsContext.Provider value={linkPreviews}>
      <MDXRemote
        compiledSource={serializedContent.compiledSource}
        frontmatter={serializedContent.frontmatter ?? {}}
        scope={serializedContent.scope ?? {}}
        components={components}
      />
    </LinkPreviewsContext.Provider>
  );
}
