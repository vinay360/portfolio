"use client";

import { CaretDownIcon, CaretRightIcon, HashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SearchTag = { value: string; name: string };
type ResultItem = {
  id: string;
  type: "page" | "heading" | "text";
  content: string;
  url: string;
  breadcrumbs?: string[];
};
type LastResult = { url: string; label: string; query: string };

const LAST_KEY = "blog-search:last";

/* ------------------------------------------------------------------ */

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useSearch(tag?: string) {
  const [search, setSearch] = useState("");
  const query = useDebounced(search, 100).trim();
  // Latest fetched result, tagged with the request it answers.
  const [result, setResult] = useState<{ key: string; data: ResultItem[] } | null>(null);
  const key = query ? `${tag ?? ""}::${query}` : "";

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ query });
    if (tag) params.set("tag", tag);
    fetch(`/api/search?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((json: ResultItem[]) => setResult({ key, data: json }))
      .catch(() => {
        /* aborted or failed: keep previous result */
      });
    return () => controller.abort();
  }, [query, tag, key]);

  const data: ResultItem[] | "empty" = !query ? "empty" : result?.key === key ? result.data : result?.data ?? [];
  const isLoading = !!query && result?.key !== key;

  return { search, setSearch, query: { data, isLoading } };
}

function useLastResult(open: boolean) {
  const [, force] = useState(0);
  const lastResult = useMemo<LastResult | null>(() => {
    if (!open) return null;
    try {
      const raw = localStorage.getItem(LAST_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      return typeof v.url === "string" && typeof v.label === "string" && typeof v.query === "string" ? v : null;
    } catch {
      return null;
    }
  }, [open]);
  const rememberResult = useCallback((v: LastResult) => {
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify(v));
    } catch {
      // ignore
    }
    force((n) => n + 1);
  }, []);
  return { lastResult, rememberResult };
}

function scrollToHash(hash: string) {
  const el = document.getElementById(decodeURIComponent(hash.replace(/^#/, "")));
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 100, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */

/** Renders the search snippet, honouring `<mark>` highlights only. */
function Highlighted({ content }: { content: string }) {
  const safe = content.replace(/<mark\b[^>]*>/gi, "<mark>").replace(/<(?!\/?mark>)[^>]*>/gi, "");
  const parts = safe.split(/(<mark>.*?<\/mark>)/g);
  const decode = (s: string) =>
    s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  return (
    <div className="min-w-0 [&_p]:m-0 [&_p]:inline">
      {parts.map((p, i) =>
        p.startsWith("<mark>") ? (
          <mark key={i}>{decode(p.slice(6, -7))}</mark>
        ) : (
          <Fragment key={i}>{decode(p)}</Fragment>
        ),
      )}
    </div>
  );
}

function ResultRow({ item, onSelect }: { item: ResultItem; onSelect: () => void }) {
  return (
    <CommandPrimitive.Item
      value={item.id}
      onSelect={onSelect}
      className={cn(
        "relative flex cursor-default flex-col items-stretch gap-0.5 overflow-hidden rounded-lg px-2.5 py-2 text-sm outline-none select-none aria-selected:bg-accent aria-selected:text-accent-foreground",
        item.type === "page" && "mt-1",
      )}
    >
      {item.breadcrumbs && item.breadcrumbs.length > 0 ? (
        <div className="inline-flex min-w-0 items-center text-xs text-muted-foreground empty:hidden">
          {item.breadcrumbs.map((b, i) => (
            <Fragment key={`${item.id}-bc-${i}`}>
              {i > 0 ? <CaretRightIcon weight="bold" className="size-3.5 shrink-0 text-muted-foreground/70" /> : null}
              <span className="truncate">{b}</span>
            </Fragment>
          ))}
        </div>
      ) : null}
      {item.type !== "page" ? <div role="none" className="absolute inset-y-0 inset-s-3 w-px bg-border" /> : null}
      {item.type === "heading" ? (
        <HashIcon weight="bold" className="absolute inset-s-5 top-2.5 size-3.5 text-muted-foreground" />
      ) : null}
      <div
        className={cn(
          "min-w-0",
          item.type === "text" && "ps-4",
          item.type === "heading" && "ps-7",
          item.type === "page" || item.type === "heading" ? "font-medium text-foreground" : "text-foreground/80",
        )}
      >
        <Highlighted content={item.content} />
      </div>
    </CommandPrimitive.Item>
  );
}

function TagFilter({
  tags,
  value,
  onChange,
}: {
  tags: SearchTag[];
  value?: string;
  onChange: (v?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const all = useMemo<{ value?: string; name: string }[]>(() => [{ value: undefined, name: "All" }, ...tags], [tags]);
  const active = all.find((t) => t.value === value) ?? all[0];

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs transition-colors hover:bg-muted">
        <span className="text-muted-foreground">Filter</span>
        <span className="font-medium text-foreground">{active.name}</span>
        <CaretDownIcon weight="bold" className="size-3.5 text-muted-foreground" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-[120] flex w-48 flex-col gap-0.5 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {all.map((t) => {
            const selected = t.value === value;
            return (
              <button
                key={t.value ?? "all"}
                type="button"
                onClick={() => {
                  onChange(t.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                  selected ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
                )}
              >
                {t.name}
              </button>
            );
          })}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/* ------------------------------------------------------------------ */

export function BlogSearchDialog({
  open,
  onOpenChange,
  tags = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags?: SearchTag[];
}) {
  const router = useRouter();
  const [tag, setTag] = useState<string | undefined>();
  const { search, setSearch, query } = useSearch(tag);
  const { lastResult, rememberResult } = useLastResult(open);

  const items = query.data && query.data !== "empty" ? query.data : [];
  const trimmed = search.trim();
  const hasQuery = !!trimmed;
  const showLast = !hasQuery && !!lastResult;
  const hasHeaderBorder = hasQuery || showLast;

  const close = () => {
    onOpenChange(false);
    setTag(undefined);
  };

  const select = (item: ResultItem) => {
    rememberResult({ url: item.url, label: item.content.replace(/<[^>]+>/g, ""), query: trimmed });
    close();
    const i = item.url.indexOf("#");
    const hash = i >= 0 ? item.url.slice(i) : "";
    router.push(item.url, { scroll: false });
    if (hash) scrollToHash(hash);
  };

  const selectLast = () => {
    if (!lastResult) return;
    close();
    router.push(lastResult.url, { scroll: false });
    const i = lastResult.url.indexOf("#");
    if (i >= 0) scrollToHash(lastResult.url.slice(i));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent
        showCloseButton={false}
        className="top-[20vh] left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-screen-sm"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Blog</DialogTitle>
          <DialogDescription>Full-text search across blog titles, headings, and paragraphs</DialogDescription>
        </DialogHeader>
        <CommandPrimitive shouldFilter={false} className="bg-popover">
          <div className={cn("flex items-center gap-2 px-3 py-3", hasHeaderBorder && "border-b border-border/60")}>
            <MagnifyingGlassIcon
              weight="bold"
              className={cn("size-5 shrink-0 text-muted-foreground", query.isLoading && hasQuery && "animate-pulse")}
            />
            <CommandPrimitive.Input
              value={search}
              onValueChange={setSearch}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  close();
                }
              }}
              placeholder="Search blog posts"
              className="w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 px-2 font-mono text-[0.65rem] text-muted-foreground"
              onClick={close}
            >
              ESC
            </Button>
          </div>
          <CommandPrimitive.List className="max-h-[min(28rem,60vh)] scroll-py-2 overflow-y-auto p-1 **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground">
            {showLast && lastResult ? (
              <CommandPrimitive.Group heading="Last searched">
                <CommandPrimitive.Item
                  value={`last-${lastResult.url}`}
                  onSelect={selectLast}
                  className="relative flex cursor-default flex-col gap-0.5 rounded-lg px-2.5 py-2 text-sm outline-none select-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <span className="truncate font-medium text-foreground">{lastResult.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{lastResult.query}</span>
                </CommandPrimitive.Item>
              </CommandPrimitive.Group>
            ) : null}
            {query.isLoading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Searching...</p>
            ) : null}
            {!query.isLoading && hasQuery && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No results found.</p>
            ) : null}
            {items.map((item) => (
              <ResultRow key={item.id} item={item} onSelect={() => select(item)} />
            ))}
          </CommandPrimitive.List>
          {tags.length > 0 ? (
            <div className="border-t border-border/60 px-3 py-2.5">
              <TagFilter tags={tags} value={tag} onChange={setTag} />
            </div>
          ) : null}
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
