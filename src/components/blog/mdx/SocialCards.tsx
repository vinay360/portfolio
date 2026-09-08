"use client";

import { InstagramLogoIcon, XLogoIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function normalizeInstagram(url: string) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const kind = parts[0] === "p" || parts[0] === "reel" ? parts[0] : "reel";
    const id = parts[1] ?? "";
    return id ? `https://www.instagram.com/${kind}/${id}/` : `https://www.instagram.com/${kind}/`;
  } catch {
    return url;
  }
}

function normalizeTwitter(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("x.com")) u.hostname = "twitter.com";
    u.search = "";
    return u.toString();
  } catch {
    return url;
  }
}

function SocialCard({
  href,
  icon,
  maxWidth,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  maxWidth: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full justify-center my-10", className)}>
      <div
        onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
        className={cn(
          "group relative w-full bg-card border border-border rounded-xl cursor-pointer transition-all hover:border-primary overflow-hidden social-card-shadow",
          maxWidth,
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] pb-8">{icon}</div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs">Click to see post</p>
        </div>
      </div>
    </div>
  );
}

export function TwitterCard({ url, className }: { url: string; className?: string }) {
  return (
    <SocialCard
      href={normalizeTwitter(url)}
      maxWidth="max-w-md"
      className={className}
      icon={<XLogoIcon className="h-20 w-20 text-card-foreground" />}
    />
  );
}

export function InstagramCard({ url, className }: { url: string; className?: string }) {
  return (
    <SocialCard
      href={normalizeInstagram(url)}
      maxWidth="max-w-sm"
      className={className}
      icon={<InstagramLogoIcon className="h-20 w-20 text-card-foreground" />}
    />
  );
}

/** Side-by-side X + Instagram cards (used in the "Winter arc" / "Go in bits" posts). */
export function WinterCards({
  x,
  instagram,
  className,
}: {
  x?: string;
  instagram?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4", "md:grid-cols-2", "[&>*]:rounded-lg  [&>*]:p-2", className)}>
      {!!x && (
        <div className="overflow-hidden">
          <TwitterCard url={x} className="block" />
        </div>
      )}
      {!!instagram && (
        <div className="overflow-hidden">
          <InstagramCard url={instagram} className="block" />
        </div>
      )}
    </div>
  );
}
