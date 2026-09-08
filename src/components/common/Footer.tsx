"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/common/Container";
import { footerLinks, socialLinks } from "@/data/socials";
import { SITE_NAME } from "@/lib/site";
import { triggerHaptic } from "@/lib/haptics";

function ordinal(n: number) {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return "st";
  if (a === 2 && b !== 12) return "nd";
  if (a === 3 && b !== 13) return "rd";
  return "th";
}

function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/visitors")
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch visitor count");
          const data = await res.json();
          if (!data.success) throw new Error(data.error ?? "Failed to fetch visitor count");
          return data.visitors as number;
        })
        .then((count) => {
          if (cancelled) return;
          setVisitors(count);
          setFailed(false);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });

    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (failed || visitors === null) return null;

  return (
    <p className="text-sm text-muted-foreground">
      You&apos;re the{" "}
      <span className="font-medium text-primary">
        {visitors.toLocaleString()}
        <sup className="text-[0.65em]">{ordinal(visitors)}</sup>
      </span>{" "}
      visitor
    </p>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-site-chrome="" className="border-t border-border bg-muted/30">
      <Container className="py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Navigate</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-1">
              {footerLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => triggerHaptic("light")}
                  className="text-sm text-secondary transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Connect</p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ name, href, icon }) => (
                <Link
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic("light")}
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  aria-label={name}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm text-muted-foreground">© {year} {SITE_NAME}. All rights reserved.</p>
          <VisitorCount />
        </div>
      </Container>
    </footer>
  );
}
