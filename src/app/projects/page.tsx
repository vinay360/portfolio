import type { Metadata } from "next";

import Container from "@/components/common/Container";
import { ProjectsPageClient } from "@/components/pages/ProjectsPageClient";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Projects - Case Studies & Products",
  description: "A focused view of selected products and experiments I have built, with links to each project.",
  path: "/projects",
  image: "/meta/projects.png",
});

export default function ProjectsPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up">
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-secondary text-xs md:text-base">A few products and experiments I&apos;ve shipped.</p>
        </div>
        <ProjectsPageClient projects={projects} />
      </section>
    </Container>
  );
}
