"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable ||
    target.closest("[contenteditable='true']")
  ) {
    return true;
  }
  const role = target.getAttribute("role");
  return !!(
    role === "textbox" ||
    role === "combobox" ||
    role === "searchbox" ||
    target.closest('[role="textbox"], [role="combobox"], [role="searchbox"]')
  );
}

/** Press "D" anywhere (outside inputs) to flip between light and dark. */
function ThemeKeyboardShortcut({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === "d" || e.key === "D") {
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [theme, setTheme]);

  return <>{children}</>;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeKeyboardShortcut>{children}</ThemeKeyboardShortcut>
    </NextThemesProvider>
  );
}
