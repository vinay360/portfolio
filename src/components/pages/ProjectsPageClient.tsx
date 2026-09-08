"use client";

import Link from "next/link";

import type { Project } from "@/data/projects";
import { triggerHaptic } from "@/lib/haptics";

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
  return (
    <div className="divide-y">
      {projects.map((project, i) => (
        <article key={project.slug} className="group py-4 animate-in-up" style={{ animationDelay: `${0.05 * i}s` }}>
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("light")}
            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              <p className="line-clamp-2 text-sm text-secondary">{project.description}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
