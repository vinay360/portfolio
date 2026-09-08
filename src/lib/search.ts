import "server-only";

import { getAllPosts, getPostContent, type PostMeta } from "@/lib/blog";

export type SearchResultType = "page" | "heading" | "text";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  content: string;
  url: string;
  breadcrumbs?: string[];
}

interface IndexEntry {
  slug: string;
  title: string;
  categories: string[];
  headings: { id: string; text: string; texts: string[] }[];
  /** paragraphs before the first heading */
  intro: string[];
}

const SKIP_KEYS = new Set([
  "id",
  "className",
  "href",
  "src",
  "alt",
  "target",
  "rel",
  "style",
  "color",
  "x",
  "instagram",
  "url",
  "caption",
  "by",
  "designation",
  "type",
  "start",
]);

/** Extract a balanced `{...}` object literal starting at `start` (index of "{"). */
function balanced(src: string, start: number) {
  let depth = 0;
  let inStr: string | null = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return src.slice(start);
}

/** Collect visible text from a props object literal (string literals that are not attribute values). */
function textFromProps(props: string) {
  const out: string[] = [];
  const re = /([A-Za-z_$][\w$]*)\s*:\s*"((?:[^"\\]|\\.)*)"|"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(props))) {
    if (m[1] !== undefined) {
      if (SKIP_KEYS.has(m[1])) continue;
      out.push(m[2]);
    } else {
      out.push(m[3]);
    }
  }
  const text = out
    .map((s) => JSON.parse(`"${s}"`) as string)
    .filter((s) => s.trim().length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function buildEntry(post: PostMeta, compiledSource: string): IndexEntry {
  const headings: IndexEntry["headings"] = [];
  const intro: string[] = [];
  const re = /_jsxs?\(_components\.(h1|h2|h3|h4|p|li),\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(compiledSource))) {
    const tag = m[1];
    const objStart = m.index + m[0].length - 1;
    const props = balanced(compiledSource, objStart);
    // skip nested children of this element for the outer scan
    re.lastIndex = objStart + props.length;
    if (tag.startsWith("h")) {
      const idMatch = props.match(/\bid:\s*"((?:[^"\\]|\\.)*)"/);
      const text = textFromProps(props);
      if (!text) continue;
      const id =
        idMatch?.[1] ??
        text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      headings.push({ id, text, texts: [] });
    } else {
      const text = textFromProps(props);
      if (!text) continue;
      if (headings.length) headings[headings.length - 1].texts.push(text);
      else intro.push(text);
    }
  }
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    categories: post.frontmatter.categories ?? [],
    headings,
    intro,
  };
}

let indexPromise: Promise<IndexEntry[]> | null = null;

async function getIndex() {
  if (!indexPromise) {
    indexPromise = Promise.all(
      getAllPosts().map(async (post) => {
        const content = await getPostContent(post.slug);
        return buildEntry(post, content?.compiledSource ?? "");
      }),
    );
  }
  return indexPromise;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(text: string, terms: string[]) {
  let out = escapeHtml(text);
  for (const term of terms) {
    if (!term) continue;
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    out = out.replace(re, "<mark>$1</mark>");
  }
  return out;
}

function snippet(text: string, terms: string[], max = 160) {
  const lower = text.toLowerCase();
  const idx = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0));
  if (text.length <= max || !Number.isFinite(idx)) return text.slice(0, max) + (text.length > max ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, start + max);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

export async function searchPosts(query: string, tag?: string, limit = 40): Promise<SearchResult[]> {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length === 0) return [];

  const matches = (s: string) => {
    const l = s.toLowerCase();
    return terms.every((t) => l.includes(t));
  };

  const index = await getIndex();
  const results: SearchResult[] = [];

  for (const entry of index) {
    if (tag && !entry.categories.includes(tag)) continue;
    const url = `/blog/${entry.slug}`;
    const items: SearchResult[] = [];

    if (matches(entry.title)) {
      items.push({ id: `${entry.slug}`, type: "page", content: highlight(entry.title, terms), url });
    }
    for (const text of entry.intro) {
      if (matches(text)) {
        items.push({
          id: `${entry.slug}#intro-${items.length}`,
          type: "text",
          content: highlight(snippet(text, terms), terms),
          url,
          breadcrumbs: [entry.title],
        });
      }
    }
    for (const h of entry.headings) {
      if (matches(h.text)) {
        items.push({
          id: `${entry.slug}#${h.id}`,
          type: "heading",
          content: highlight(h.text, terms),
          url: `${url}#${h.id}`,
          breadcrumbs: [entry.title],
        });
      }
      for (const [i, text] of h.texts.entries()) {
        if (matches(text)) {
          items.push({
            id: `${entry.slug}#${h.id}-${i}`,
            type: "text",
            content: highlight(snippet(text, terms), terms),
            url: `${url}#${h.id}`,
            breadcrumbs: [entry.title, h.text],
          });
        }
      }
    }

    if (items.length) {
      // Always lead with the page so results are grouped per post.
      if (items[0].type !== "page") {
        items.unshift({ id: `${entry.slug}`, type: "page", content: escapeHtml(entry.title), url });
      }
      results.push(...items.slice(0, 8));
    }
    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}
