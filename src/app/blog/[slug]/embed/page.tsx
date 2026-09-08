import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogMDXContent } from "@/components/blog/BlogMDXContent";
import { blogHeadingFont } from "@/lib/fonts";
import { formatPostDate, getAllPosts, getPostContent, getPostMeta } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostMeta(slug);
  return { title: post?.frontmatter.title, robots: { index: false, follow: false } };
}

/** Compact post rendering loaded inside link-preview hover cards. */
export default async function BlogEmbedPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) notFound();
  const content = await getPostContent(slug);
  if (!content) notFound();
  const { title, description, publish_date } = post.frontmatter;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <style>{`[data-site-chrome]{display:none}`}</style>
      <header className="mb-6 space-y-2">
        <h1 className={`text-2xl font-bold leading-tight ${blogHeadingFont.className}`}>{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <time className="text-xs text-muted-foreground" dateTime={publish_date}>
          {formatPostDate(publish_date)}
        </time>
      </header>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <BlogMDXContent
          serializedContent={{ compiledSource: content.compiledSource, frontmatter: {}, scope: {} }}
          linkPreviews={{}}
        />
      </div>
    </div>
  );
}
