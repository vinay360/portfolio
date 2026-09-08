import { cn } from "@/lib/utils";

/** Soft blur/gradient pinned to the bottom of the viewport. */
export function BottomFade({ className }: { className?: string }) {
  return (
    <div
      data-site-chrome=""
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[60px] select-none bg-gradient-to-t from-background to-transparent opacity-100 backdrop-blur-[5px]",
        "[mask-image:linear-gradient(to_top,black_50%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_50%,transparent)]",
        "dark:[mask-image:linear-gradient(to_top,black_50%,transparent)] dark:[-webkit-mask-image:linear-gradient(to_top,black_50%,transparent)]",
        className,
      )}
      style={{ userSelect: "none" }}
    />
  );
}
