"use client";

import Link from "next/link";
import { ArrowUUpLeftIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { triggerHaptic } from "@/lib/haptics";

export function BlogPostNavigation() {
  return (
    <div>
      <Link href="/blog" className="flex items-center space-x-2" onClick={() => triggerHaptic("light")}>
        <Button variant="ghost" className="group">
          <ArrowUUpLeftIcon className="size-4" />
          <span>Back to Blog</span>
        </Button>
      </Link>
    </div>
  );
}
