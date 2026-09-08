import type { Metadata } from "next";

import Container from "@/components/common/Container";
import { InfoCard } from "@/components/pages/InfoCard";
import { Separator } from "@/components/ui/separator";
import { movies } from "@/data/movies";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Movies - My Favorites",
  description: "Movies and shows that have inspired and entertained me. A curated list of films worth watching.",
  path: "/movies",
  image: "/meta/movies.png",
});

export default function MoviesPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Movies</h1>
          <p className="max-w-2xl text-secondary">Movies and shows that have inspired and entertained me.</p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator />
        </div>
        <div className="animate-in-up space-y-6" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {movies.map((movie, i) => (
              <div key={movie.title} className="animate-in-up" style={{ animationDelay: `${0.15 + 0.05 * i}s` }}>
                <InfoCard title={movie.title} subtitle={String(movie.year)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
