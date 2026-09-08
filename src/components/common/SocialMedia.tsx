"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { socialLinks, type SocialLink } from "@/data/socials";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const keyToName: Record<string, string> = {
  x: "X",
  linkedin: "LinkedIn",
  github: "Github",
  youtube: "YouTube",
  instagram: "Instagram",
  pinterest: "Pinterest",
  medium: "Medium",
  email: "Email",
};

type SocialMediaProps = {
  x?: boolean;
  linkedin?: boolean;
  github?: boolean;
  youtube?: boolean;
  instagram?: boolean;
  pinterest?: boolean;
  medium?: boolean;
  email?: boolean;
  className?: string;
  /** Render without the enter animation (used in the hero). */
  instant?: boolean;
};

function SocialIconLink(link: SocialLink) {
  return (
    <Tooltip key={link.name} delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          title={link.name}
          onClick={() => triggerHaptic("light")}
          className="text-secondary flex items-center gap-2 transition-colors hover:text-primary"
        >
          <span className="size-6" aria-hidden="true">
            {link.icon}
          </span>
          <span className="sr-only">{link.name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{link.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function SocialMedia({ className, instant = false, ...flags }: SocialMediaProps) {
  const selected = Object.entries(flags)
    .filter(([, v]) => v === true)
    .map(([k]) => keyToName[k]);
  const links =
    selected.length === 0 ? socialLinks : socialLinks.filter((l) => selected.includes(l.name));

  if (links.length === 0) return null;

  const classes = cn("my-8 flex flex-wrap gap-2", className);
  const items = links.map((l) => SocialIconLink(l));

  if (instant) {
    return <div className={classes}>{items}</div>;
  }

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {items}
    </motion.div>
  );
}

export default SocialMedia;
