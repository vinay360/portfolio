import type { Metadata } from "next";

import Container from "@/components/common/Container";
import { ExperienceCard } from "@/components/home/ExperienceCard";
import { experiences } from "@/data/experiences";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Work Experience",
  description: "My work experiences across different companies and roles.",
  path: "/work",
  image: "/meta/work.png",
});

export default function WorkPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold">Work Experience</h1>
          <p className="text-secondary text-xs md:text-base">
            My work experiences across different companies and roles.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {experiences.map((experience, i) => (
            <div key={experience.company} className="animate-in-up" style={{ animationDelay: `${0.05 * i}s` }}>
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
