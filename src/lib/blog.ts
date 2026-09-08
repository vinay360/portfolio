import postsIndex from "@/data/posts/index.json";

export interface PostFrontmatter {
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) */
  publish_date: string;
  image?: string;
  categories?: string[];
  tags?: string[];
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface PostContent {
  slug: string;
  /** next-mdx-remote compiled MDX (function body) */
  compiledSource: string;
  /** Pre-fetched previews for internal blog links, keyed by slug */
  linkPreviews: Record<string, { slug: string; title: string; description?: string }>;
}

type IndexEntry = {
  slug: string;
  title: string;
  description: string;
  publish_date: string;
  image?: string;
  categories?: string[];
  tags?: string[];
};

// index.json is already in the site's display order (newest first, by post id).
const allPosts: PostMeta[] = (postsIndex as IndexEntry[]).map(({ slug, ...frontmatter }) => ({
  slug,
  frontmatter,
}));

export function getAllPosts(): PostMeta[] {
  return allPosts;
}

export function getPostMeta(slug: string): PostMeta | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export async function getPostContent(slug: string): Promise<PostContent | null> {
  try {
    const mod = await import(`@/data/posts/${slug}.json`);
    return (mod.default ?? mod) as PostContent;
  } catch {
    return null;
  }
}

export interface Category {
  name: string;
  count: number;
}

export function getCategories(): Category[] {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const c of post.frontmatter.categories ?? []) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getSearchTags() {
  return getCategories()
    .map((c) => ({ value: c.name, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Related posts: share the most categories, then most recent. */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPostMeta(slug);
  if (!current) return [];
  const cats = new Set(current.frontmatter.categories ?? []);
  return allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: (p.frontmatter.categories ?? []).filter((c) => cats.has(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export function getAdjacentPosts(slug: string) {
  const i = allPosts.findIndex((p) => p.slug === slug);
  return {
    newer: i > 0 ? allPosts[i - 1] : null,
    older: i >= 0 && i < allPosts.length - 1 ? allPosts[i + 1] : null,
  };
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getOgThumbUrl(image: string) {
  return `${image.replace(/\.[^.]+$/, "")}-thumb.webp`;
}
