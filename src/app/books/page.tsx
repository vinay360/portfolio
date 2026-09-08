import type { Metadata } from "next";
import { BookOpenIcon } from "@phosphor-icons/react/dist/ssr";

import Container from "@/components/common/Container";
import { SectionHeading } from "@/components/pages/CodeBlock";
import { InfoCard } from "@/components/pages/InfoCard";
import { Separator } from "@/components/ui/separator";
import { bookCategories } from "@/data/books";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Books - My Reading List",
  description:
    "A collection of books that have influenced my thinking and growth. From personal development to business and creativity.",
  path: "/books",
  image: "/meta/books.png",
});

export default function BooksPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Books</h1>
          <p className="max-w-2xl text-secondary">
            A collection of books that have influenced my thinking and growth.
          </p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator />
        </div>
        <div className="space-y-12">
          {bookCategories.map((category, cIdx) => {
            const delay = 0.1 + 0.05 * cIdx;
            return (
              <div key={category.title} className="animate-in-up space-y-6" style={{ animationDelay: `${delay}s` }}>
                <SectionHeading icon={<BookOpenIcon className="size-4" />} title={category.title} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                  {category.books.map((book, i) => (
                    <div
                      key={book.title}
                      className="animate-in-up"
                      style={{ animationDelay: `${delay + 0.05 * (i + 1)}s` }}
                    >
                      <InfoCard title={book.title} subtitle={book.author} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
