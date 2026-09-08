"use client";

import Link from "next/link";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useState, useSyncExternalStore } from "react";

import Container from "@/components/common/Container";
import { useKeyboardShortcutsContextSafe } from "@/components/providers/KeyboardShortcutsProvider";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { navLinks } from "@/data/socials";
import { triggerHaptic } from "@/lib/haptics";

const noopSubscribe = () => () => {};

function isApplePlatform() {
  const p = navigator.platform?.toLowerCase() ?? "";
  return p.includes("mac") || p.includes("iphone") || p.includes("android") || p.includes("ipad");
}

function SearchButton() {
  const shortcuts = useKeyboardShortcutsContextSafe();
  // Resolved on the client without a post-mount re-render; server assumes Ctrl.
  const isMac = useSyncExternalStore(noopSubscribe, isApplePlatform, () => false);

  if (!shortcuts) return null;

  return (
    <button
      type="button"
      data-slot="button"
      data-variant="outline"
      data-size="sm"
      className="group/button inline-flex shrink-0 items-center justify-center text-muted-foreground transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 sm:border sm:bg-clip-padding sm:text-sm sm:font-medium sm:whitespace-nowrap sm:border-border sm:bg-background aria-expanded:bg-muted aria-expanded:text-foreground dark:sm:border-input dark:sm:bg-input/30 sm:h-8 sm:px-2.5 sm:in-data-[slot=button-group]:rounded-lg sm:has-data-[icon=inline-end]:pr-1.5 sm:has-data-[icon=inline-start]:pl-1.5 sm:gap-1.5 sm:rounded-full sm:shadow-none sm:hover:bg-background sm:hover:text-muted-foreground dark:sm:hover:bg-input/30"
      onClick={shortcuts.openCommandPalette}
      aria-label={`Open blog search (${isMac ? "⌘K" : "Ctrl+K"})`}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10.278 11.514a5.824 5.824 0 1 1 1.235-1.235l3.209 3.208A.875.875 0 0 1 14.111 15a.875.875 0 0 1-.624-.278l-3.209-3.208Zm.623-4.69a4.077 4.077 0 1 1-8.154 0 4.077 4.077 0 0 1 8.154 0Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <KbdGroup className="items-center gap-1 hidden sm:flex">
        {isMac ? <Kbd className="w-5 min-w-5">⌘</Kbd> : <Kbd className="w-fit min-w-6">Ctrl</Kbd>}
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>
    </button>
  );
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  if (!mounted) {
    return (
      <span className="inline-flex size-8 items-center justify-center rounded-md" aria-hidden>
        <span className="size-4 rounded-full bg-muted" />
      </span>
    );
  }

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setTheme(isDark ? "light" : "dark");
          }}
          className="navbar-theme-toggle group relative inline-flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={label}
        >
          <MoonIcon
            weight="regular"
            className={`absolute size-4 transition-[opacity,transform] duration-200 ease-out ${
              isDark ? "opacity-0 scale-50" : "opacity-100 scale-100"
            }`}
            aria-hidden
          />
          <SunIcon
            weight="regular"
            className={`absolute size-4 transition-[opacity,transform] duration-200 ease-out ${
              isDark ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            aria-hidden
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>Toggle mode (D)</TooltipContent>
    </Tooltip>
  );
}

export function Navbar() {
  return (
    <header
      data-site-chrome=""
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <Container className="flex h-14 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => triggerHaptic("light")}
              className="text-secondary transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <SearchButton />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
