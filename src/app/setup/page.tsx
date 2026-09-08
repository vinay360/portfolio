import type { Metadata } from "next";

import Container from "@/components/common/Container";
import { SetupPageClient } from "@/components/pages/SetupPageClient";
import { Separator } from "@/components/ui/separator";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Setup Guide - VS Code Configuration",
  description:
    "Complete guide to setting up VS Code with my preferred configuration, extensions, and fonts for optimal development.",
  path: "/setup",
  image: "/meta/setup.png",
});

export default function SetupPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Setup</h1>
          <p className="max-w-2xl text-secondary">Complete guide to setting up VSCode / Cursor with my settings.</p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator />
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.1s" }}>
          <SetupPageClient />
        </div>
      </section>
    </Container>
  );
}
