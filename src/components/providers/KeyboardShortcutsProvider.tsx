"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SearchTag = { value: string; name: string };

const BlogSearchDialog = dynamic(
  () => import("@/components/blog/BlogSearchDialog").then((m) => m.BlogSearchDialog),
  { ssr: false },
);

type KeyboardShortcutsContextValue = {
  openCommandPalette: () => void;
  toggleCommandPalette: () => void;
};

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | undefined>(
  undefined,
);

export function useKeyboardShortcutsContext() {
  const ctx = useContext(KeyboardShortcutsContext);
  if (!ctx) {
    throw new Error("useKeyboardShortcutsContext must be used within KeyboardShortcutsProvider");
  }
  return ctx;
}

export function useKeyboardShortcutsContextSafe() {
  return useContext(KeyboardShortcutsContext);
}

export function KeyboardShortcutsProvider({
  children,
  searchTags = [],
}: {
  children: React.ReactNode;
  searchTags?: SearchTag[];
}) {
  const [open, setOpen] = useState(false);
  // Only mount the (heavy) dialog after the first request to open it.
  const [mounted, setMounted] = useState(false);

  const openCommandPalette = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setMounted(true);
    setOpen((v) => !v);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      toggleCommandPalette();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleCommandPalette]);

  const value = useMemo(
    () => ({ toggleCommandPalette, openCommandPalette }),
    [toggleCommandPalette, openCommandPalette],
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      {mounted ? <BlogSearchDialog open={open} onOpenChange={setOpen} tags={searchTags} /> : null}
    </KeyboardShortcutsContext.Provider>
  );
}
