"use client";

import { useState } from "react";

/** Icon-only pill that reveals its label on hover (first hover is delayed). */
export function TechBadge({ name, children }: { name: string; children: React.ReactNode }) {
  const [hoveredOnce, setHoveredOnce] = useState(false);

  return (
    <div
      onMouseEnter={() => setHoveredOnce(true)}
      className={`group inline-flex items-center gap-0 rounded-md border border-dashed border-border bg-muted/50 px-2 py-1 text-sm font-medium text-foreground outline-none transition-all duration-300 ease-out hover:scale-[1.03] hover:gap-1.5 hover:border-border hover:bg-muted hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:gap-1.5 ${
        hoveredOnce ? "hover:delay-0" : "hover:delay-150"
      }`}
    >
      <span className="size-4 shrink-0 [&_svg]:size-4">{children}</span>
      <span
        className={`max-w-0 overflow-hidden opacity-0 whitespace-nowrap transition-all duration-300 ease-out group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:max-w-32 group-focus-visible:opacity-100 ${
          hoveredOnce
            ? "group-hover:delay-0 group-focus-visible:delay-0"
            : "group-hover:delay-150 group-focus-visible:delay-150"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
