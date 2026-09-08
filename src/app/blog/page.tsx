import type { Metadata } from "next";

import { BlogPageClient } from "@/components/blog/BlogPageClient";
import Container from "@/components/common/Container";
import { getAllPosts, getCategories } from "@/lib/blog";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Thoughts, tutorials, and insights on engineering and programming.",
  path: "/blog",
  image: "/meta/blogs.png",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-secondary text-xs md:text-base">
            Thoughts, tutorials, and insights on engineering and programming.
          </p>
        </div>
        <BlogPageClient initialPosts={posts} categories={categories} />
      </section>
    </Container>
  );
}
