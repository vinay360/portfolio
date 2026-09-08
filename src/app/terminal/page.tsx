import type { Metadata } from "next";

import Container from "@/components/common/Container";
import { TerminalSetupClient } from "@/components/pages/TerminalSetupClient";
import { Separator } from "@/components/ui/separator";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terminal Setup - Zsh Configuration Guide",
  description:
    "Complete guide to setting up a modern zsh terminal with starship, fastfetch, fzf, and zoxide for macOS and Linux.",
  path: "/terminal",
  image: "/meta/terminal.png",
});

export default function TerminalPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Terminal Setup</h1>
          <p className="max-w-2xl text-secondary">Below is my terminal setup configuration.</p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator />
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.1s" }}>
          <TerminalSetupClient />
        </div>
      </section>
    </Container>
  );
}
