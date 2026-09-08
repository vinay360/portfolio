import Link from "next/link";

import { AnimateInView } from "@/components/common/AnimateInView";
import Container from "@/components/common/Container";
import { BlogList } from "@/components/blog/BlogList";
import { ExperienceCardExpandable } from "@/components/home/ExperienceCard";
import { Hero } from "@/components/home/Hero";
import { LinkCard } from "@/components/home/LinkCard";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/experiences";
import { getAllPosts } from "@/lib/blog";

const development = [
  { href: "/gears", title: "Gears", description: "Tools, devices, and software I use to get work done." },
  { href: "/setup", title: "Setup", description: "VSCode / Cursor configuration and extensions guide." },
  { href: "/terminal", title: "Terminal", description: "Zsh, Starship, Fastfetch, and shell configuration." },
];

const personal = [
  { href: "/books", title: "Books", description: "Books that have influenced my thinking and growth." },
  { href: "/movies", title: "Movies", description: "Films and shows that have inspired and entertained me." },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="space-y-10 pt-8">
      <Container>
        <Hero />
      </Container>

      <Container>
        <section className="space-y-2">
          <AnimateInView>
            <h2 className="text-xl font-bold">Experience</h2>
          </AnimateInView>
          <div className="flex flex-col gap-4">
            {experiences.slice(0, 3).map((experience, i) => (
              <AnimateInView key={experience.company} style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
                <ExperienceCardExpandable experience={experience} />
              </AnimateInView>
            ))}
          </div>
          <AnimateInView className="flex justify-center pt-2" style={{ animationDelay: "0.2s" }}>
            <Button variant="outline" asChild className="text-sm font-medium">
              <Link href="/work">Show all work experiences</Link>
            </Button>
          </AnimateInView>
        </section>
      </Container>

      <Container>
        <section className="space-y-2">
          <AnimateInView>
            <h2 className="text-2xl font-bold">Blog</h2>
          </AnimateInView>
          <AnimateInView className="flex flex-col gap-2" style={{ animationDelay: "0.05s" }}>
            <BlogList posts={posts} enableHoverEffects={false} />
            <div className="flex justify-center pt-2">
              <Link href="/blog">
                <Button variant="outline">Show all blogs</Button>
              </Link>
            </div>
          </AnimateInView>
        </section>
      </Container>

      <Container>
        <section className="space-y-2">
          <AnimateInView>
            <h2 className="text-2xl font-bold">Development</h2>
          </AnimateInView>
          <div className="flex flex-col gap-2">
            {development.map((item, i) => (
              <AnimateInView key={item.href} style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
                <LinkCard {...item} />
              </AnimateInView>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="space-y-2">
          <AnimateInView>
            <h2 className="text-2xl font-bold">Personal</h2>
          </AnimateInView>
          <div className="flex flex-col gap-2">
            {personal.map((item, i) => (
              <AnimateInView key={item.href} style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
                <LinkCard {...item} />
              </AnimateInView>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
