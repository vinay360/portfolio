"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { EMAIL } from "@/data/socials";
import { triggerHaptic } from "@/lib/haptics";

/** Email address with a copy-to-clipboard micro interaction. */
export function HeroEmailCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      triggerHaptic("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const label = copied ? "Copied" : "Copy email";

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={copy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copy();
        }
      }}
      className="group inline-flex cursor-pointer items-center gap-1.5 text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group group-hover:text-primary"
      aria-label={label}
    >
      <span className="group-hover:text-primary hidden md:block">{EMAIL}</span>
      <span className="group-hover:text-primary block md:hidden">Email</span>
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center group-hover:text-primary">
        <CopyIcon
          weight="regular"
          className={`absolute inset-0 size-4 text-current transition-[opacity,transform] duration-200 ease-out ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
          aria-hidden
        />
        <CheckIcon
          weight="bold"
          className={`absolute inset-0 size-4 transition-[opacity,transform] duration-200 ease-out ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          aria-hidden
        />
      </span>
    </span>
  );
}
