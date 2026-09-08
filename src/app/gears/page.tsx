import type { Metadata } from "next";
import Link from "next/link";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr";

import Container from "@/components/common/Container";
import { SectionHeading, StepNumber } from "@/components/pages/CodeBlock";
import { Separator } from "@/components/ui/separator";
import { devices, extensions, extensionsIcon, software, softwareIcon, type LinkItem } from "@/data/gears";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Gears - My Setup & Tools",
  description: "Discover the tools, devices, and software I use to get my work done efficiently.",
  path: "/gears",
  image: "/meta/gears.png",
});

function LinkList({
  title,
  icon,
  items,
  delay,
}: {
  title: string;
  icon: React.ReactNode;
  items: LinkItem[];
  delay: number;
}) {
  return (
    <div className="animate-in-up space-y-4 pt-10" style={{ animationDelay: `${delay}s` }}>
      <SectionHeading icon={icon} title={title} />
      <div className="mt-8 flex flex-col flex-wrap gap-4">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="animate-in-up flex items-center gap-4"
            style={{ animationDelay: `${delay + 0.05 * (i + 1)}s` }}
          >
            <div className="flex items-center gap-2">
              <StepNumber>{i + 1}</StepNumber>
              <h3 className="ml-4 flex items-center gap-1 text-sm text-secondary">
                <Link className="no-underline" target="_blank" rel="noopener noreferrer" href={item.href}>
                  {item.name}
                </Link>
                <LinkIcon className="size-4" />
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GearsPage() {
  return (
    <Container>
      <section className="space-y-4 pt-8">
        <div className="animate-in-up pb-8">
          <h1 className="text-2xl font-bold tracking-tight">Gears</h1>
          <p className="max-w-2xl text-secondary">My gears and tools I use to get my work done.</p>
        </div>
        <div className="animate-in-up" style={{ animationDelay: "0.05s" }}>
          <Separator />
        </div>

        <div className="animate-in-up space-y-4" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-semibold">Devices &amp; Accessories</h2>
          <div className="flex flex-col flex-wrap gap-4">
            {devices.map((device, i) => (
              <div
                key={device.name}
                className="animate-in-up flex min-w-0 items-center gap-4"
                style={{ animationDelay: `${0.15 + 0.05 * i}s` }}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                  {device.icon}
                </div>
                <Link
                  className="group flex min-w-0 max-w-[55vw] flex-1 items-center gap-2 no-underline sm:max-w-none sm:justify-start"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={device.href}
                >
                  <h3 className="min-w-0 truncate text-xs text-secondary group-hover:underline sm:text-sm">
                    {device.name}
                  </h3>
                  <span className="shrink-0">
                    <LinkIcon className="size-4 text-secondary" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <LinkList title="Web Extensions" icon={extensionsIcon} items={extensions} delay={0.2} />
        <LinkList title="Software" icon={softwareIcon} items={software} delay={0.3} />
      </section>
    </Container>
  );
}
