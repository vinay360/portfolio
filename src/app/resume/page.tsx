import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Resume - Professional CV",
  description:
    "View and download Vinay Agarwal's professional resume and CV. Technical skills, experience, and qualifications.",
  path: "/resume",
  image: "/meta/resume.png",
});

/**
 * Google Drive *preview* link for the resume PDF, e.g.
 * https://drive.google.com/file/d/<FILE_ID>/preview
 * Leave empty to show the fallback instead of an embed.
 */
const RESUME_URL = "https://drive.google.com/file/d/1YG-lzzo-qgfxyYX98a9SuZ8uEPBerIie/preview";

export default function ResumePage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
          <p className="max-w-2xl text-secondary">View and download my professional resume.</p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator className="mb-6" />
        </div>
        {RESUME_URL ? (
          <div
            className="animate-in-up overflow-hidden rounded-lg border border-border bg-muted/30"
            style={{ animationDelay: "0.1s" }}
          >
            <iframe src={RESUME_URL} title="Resume" className="h-[70vh] w-full min-h-[500px]" />
          </div>
        ) : (
          <div
            className="animate-in-up flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-lg border border-border bg-muted/30 p-8 text-center"
            style={{ animationDelay: "0.1s" }}
          >
            <p className="max-w-md text-secondary">
              My resume isn&apos;t hosted here yet. In the meantime, my experience and projects are on this site.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/work">Work experience</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/projects">Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://www.linkedin.com/in/vinagrwl/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </Container>
  );
}
