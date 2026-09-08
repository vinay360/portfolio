import { getAllPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = (post.frontmatter.categories ?? [])
        .map((c) => `      <category>${escape(c)}</category>`)
        .join("\n");
      return `    <item>
      <title>${escape(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.frontmatter.description)}</description>
      <pubDate>${new Date(post.frontmatter.publish_date).toUTCString()}</pubDate>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_NAME)} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Thoughts, tutorials, and insights on engineering and programming.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(posts[0]?.frontmatter.publish_date ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
