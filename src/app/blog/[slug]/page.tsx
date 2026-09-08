import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogComments } from "@/components/blog/BlogComments";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogList } from "@/components/blog/BlogList";
import { BlogMDXContent } from "@/components/blog/BlogMDXContent";
import { BlogPostNavigation } from "@/components/blog/BlogPostNavigation";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getPostContent, getPostMeta, getRelatedPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL, buildMetadata } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) return {};
  const { title, description, image, publish_date, categories } = post.frontmatter;
  const base = buildMetadata({ title, description, path: `/blog/${slug}`, image: image ?? "/meta/blogs.png" });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: new Date(publish_date).toISOString(),
      authors: [SITE_NAME],
      tags: categories,
    },
  };
}

function ContentSkeleton() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert animate-pulse">
      <div className="mb-4 h-4 w-3/4 rounded bg-muted" />
      <div className="mb-4 h-4 w-full rounded bg-muted" />
      <div className="mb-4 h-4 w-5/6 rounded bg-muted" />
    </div>
  );
}

async function PostBody({ slug }: { slug: string }) {
  const content = await getPostContent(slug);
  if (!content) return null;
  return (
    <BlogMDXContent
      serializedContent={{ compiledSource: content.compiledSource, frontmatter: {}, scope: {} }}
      linkPreviews={content.linkPreviews}
    />
  );
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostMeta(slug);
  if (!post) notFound();

  const { frontmatter } = post;
  const related = getRelatedPosts(slug, 3);
  const url = `${SITE_URL}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image ? `${SITE_URL}${frontmatter.image}` : undefined,
    datePublished: new Date(frontmatter.publish_date).toISOString(),
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: (frontmatter.categories ?? []).join(", "),
    url,
  };

  return (
    <Container className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="space-y-12">
        <BlogPostNavigation />
        <div className="space-y-12">
          {frontmatter.image && (
            <div className="mx-auto max-w-5xl">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                width={1200}
                height={630}
                className="w-full rounded-xl object-cover"
              />
            </div>
          )}
          <BlogContent frontmatter={frontmatter} slug={slug}>
            <Suspense fallback={<ContentSkeleton />}>
              <PostBody slug={slug} />
            </Suspense>
          </BlogContent>
        </div>
        <div className="mx-auto max-w-4xl">
          <BlogComments term={`blog/${slug}`} />
        </div>
        {related.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <h2 className="text-2xl font-semibold">Related Posts</h2>
            <BlogList posts={related} />
          </div>
        )}
        <div className="text-center">
          <Separator className="mb-8" />
          <Link href="/blog">
            <Button size="lg">View All Blogs</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
