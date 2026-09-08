"use client";

import { CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { triggerHaptic } from "@/lib/haptics";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      triggerHaptic("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <button
      onClick={copy}
      type="button"
      className={`flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary ${className}`}
    >
      <CopyIcon className="size-3" />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/** Dark code frame used on the setup/terminal pages. */
export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-border bg-muted/50 p-1">
      {title && (
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="relative overflow-hidden rounded-xl border bg-[oklch(0.205_0_0)] shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_var(--color-black)/4%] dark:before:shadow-[0_-1px_var(--color-white)/8%]">
        <div className="overflow-x-auto">
          <pre className="p-4 text-xs">
            <code className="block whitespace-pre font-mono leading-relaxed text-secondary">{code}</code>
          </pre>
        </div>
      </div>
      {!title && (
        <div className="flex justify-end px-3 py-2">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}

/** Small numbered box ("1", "2.3", …) used for step lists. */
export function StepNumber({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-7 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
      <span className="text-sm text-secondary">{children}</span>
    </div>
  );
}

/** Icon box + section heading. */
export function SectionHeading({
  icon,
  title,
  small = false,
}: {
  icon: React.ReactNode;
  title: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
        {icon}
      </div>
      <h2 className={small ? "text-xl font-semibold sm:text-2xl" : "text-2xl font-semibold"}>{title}</h2>
    </div>
  );
}
