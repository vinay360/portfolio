import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-row items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 no-underline transition-colors hover:bg-muted/60"
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <h3 className="text-base font-semibold leading-tight text-primary transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="line-clamp-2 text-xs text-secondary sm:text-sm">{description}</p>
      </div>
      <span className="inline-flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
