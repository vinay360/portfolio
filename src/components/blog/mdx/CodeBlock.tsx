"use client";

import { ClipboardTextIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { triggerHaptic } from "@/lib/haptics";

/** Copy button that fades in when hovering a code block. */
export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      triggerHaptic("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <form
      action={copy}
      className="absolute top-3 right-3 rounded-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:cursor-pointer"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <ClipboardTextIcon className="h-4 w-4 text-green-500" />
          </TooltipTrigger>
          <TooltipContent>Copied to clipboard!</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <CopyIcon className="h-4 w-4 text-secondary" />
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
      )}
    </form>
  );
}
