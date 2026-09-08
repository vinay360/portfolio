"use client";

import { useState } from "react";

import { BlogList } from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import type { Category, PostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full text-sm font-normal transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
    >
      {label}
      <span
        className={cn(
          "ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0 text-[10px] font-medium leading-none",
          active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Button>
  );
}

export function BlogPageClient({
  initialPosts,
  categories,
}: {
  initialPosts: PostMeta[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const hidden = Math.max(0, categories.length - 5);
  const visible = showAll ? categories : categories.slice(0, 5);

  const posts = selected
    ? initialPosts.filter((p) => (p.frontmatter.categories ?? []).includes(selected))
    : initialPosts;

  return (
    <div className="flex flex-col gap-6">
      {categories.length > 0 && (
        <div className="animate-in-up flex flex-wrap gap-2" style={{ animationDelay: "0.05s" }}>
          <CategoryPill label="All" count={initialPosts.length} active={selected === null} onClick={() => setSelected(null)} />
          {visible.map((c) => (
            <CategoryPill
              key={c.name}
              label={c.name}
              count={c.count}
              active={selected === c.name}
              onClick={() => setSelected(c.name)}
            />
          ))}
          {hidden > 0 && (
            <Button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="rounded-full bg-muted text-sm font-normal text-muted-foreground hover:bg-muted/80"
              aria-expanded={showAll}
            >
              {showAll ? `${hidden} Hide` : `${hidden} Show all`}
            </Button>
          )}
        </div>
      )}
      <div className="animate-in-up" style={{ animationDelay: "0.1s" }}>
        {posts.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4 py-12 text-center">
            <h2 className="text-2xl font-semibold">No posts found</h2>
            <p className="text-muted-foreground">Try selecting a different category.</p>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Clear filter
            </Button>
          </div>
        ) : (
          <BlogList posts={posts} showCategories />
        )}
      </div>
    </div>
  );
}
