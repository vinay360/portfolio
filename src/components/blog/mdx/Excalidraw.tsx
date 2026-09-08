"use client";

import { XIcon } from "@phosphor-icons/react";
import { LayoutGroup, motion } from "motion/react";
import { useTheme } from "next-themes";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useId, useState } from "react";

import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { FrameBorder } from "./GridFrame";
import { layoutSpring } from "./image-sets";

function isDarkHex(hex: string) {
  const t = hex.trim();
  if (!t.startsWith("#")) return null;
  let h = t.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const n = Number.parseInt(h, 16);
  if (!Number.isFinite(n)) return null;
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 < 0.5;
}

function detectTheme(svg: string): "dark" | "light" {
  const bg = svg.match(/<svg\b[\s\S]*?<rect\b[^>]*\bfill="(#[^"]+|transparent|none)"/i);
  if (bg?.[1] && bg[1] !== "transparent" && bg[1] !== "none") return isDarkHex(bg[1]) ? "dark" : "light";
  const stroke = svg.match(/\s(?:stroke|fill)="(#[0-9a-fA-F]{3,8})"/i);
  return stroke?.[1] && isDarkHex(stroke[1]) ? "light" : "dark";
}

function SvgHtml({
  html,
  invert,
  label,
  className,
  hidden,
}: {
  html: string;
  invert: boolean;
  label?: string;
  className?: string;
  hidden?: boolean;
}) {
  return (
    <div
      className={cn(
        "[&_svg>rect:first-of-type]:fill-transparent!",
        "[&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full",
        invert && "invert hue-rotate-180",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      role={hidden ? undefined : "img"}
      aria-label={hidden ? undefined : label}
      aria-hidden={hidden || undefined}
    />
  );
}

export function Excalidraw({
  src,
  caption,
  alt = "Excalidraw diagram",
  sourceTheme,
  className = "",
}: {
  src: string;
  caption?: string;
  alt?: string;
  sourceTheme?: "dark" | "light";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const layoutId = useId();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to load ${src}`);
        const text = await res.text();
        if (cancelled) return;
        setSvg(
          text
            .replace(/<\?xml[\s\S]*?\?>/i, "")
            .replace(/<!DOCTYPE[\s\S]*?>/i, "")
            .replace(/<metadata\b[^>]*>[\s\S]*?<\/metadata>/gi, "")
            .trim()
            .replace(
              /(<svg\b[^>]*>)([\s\S]*?)(<rect\b)([^>]*\bfill=")([^"]*)(")/i,
              (m, a: string, b: string, c: string, d: string, _e: string, f: string) =>
                /<(?:path|g|text|circle|ellipse|line)\b/i.test(b) ? m : `${a}${b}${c}${d}transparent${f}`,
            ),
        );
      } catch (e) {
        if (cancelled) return;
        setSvg("");
        setError(e instanceof Error ? e.message : "Failed to load diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const invert = (sourceTheme ?? (svg ? detectTheme(svg) : "dark")) === "dark" !== (resolvedTheme === "dark");

  return (
    <motion.div
      className="my-8 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {error ? (
        <pre className="w-full whitespace-pre-wrap text-sm text-destructive">{error}</pre>
      ) : svg ? (
        <LayoutGroup>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div
                className={cn(
                  "p-4 not-prose relative cursor-zoom-in bg-gray-50/50 rounded-2xl overflow-hidden dark:bg-gray-800/25",
                  className,
                )}
              >
                <div className="relative rounded-xl overflow-hidden flex justify-center p-2">
                  <motion.div
                    className="relative overflow-hidden rounded-lg w-full"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
                  >
                    {open ? (
                      <SvgHtml html={svg} invert={invert} hidden className="[&_svg]:max-h-92 opacity-0" />
                    ) : (
                      <motion.div
                        layoutId={layoutId}
                        layout
                        className="relative overflow-hidden rounded-lg"
                        transition={{ layout: layoutSpring }}
                        style={{ willChange: "transform" }}
                      >
                        <SvgHtml html={svg} invert={invert} label={alt} className="[&_svg]:max-h-92" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                <FrameBorder />
              </div>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay
                className="bg-white/60 backdrop-blur-3xl dark:bg-black/60"
                onPointerDown={(e) => {
                  if (e.button === 0) setOpen(false);
                }}
              />
              <DialogPrimitive.Content
                className={cn(
                  "fixed inset-0 z-51 border-none bg-transparent p-0 shadow-none outline-none",
                  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                )}
                onEscapeKeyDown={() => setOpen(false)}
                asChild
              >
                <div className="fixed inset-0 outline-none">
                  <div
                    role="presentation"
                    className="absolute inset-0 z-0 bg-transparent"
                    aria-hidden
                    onPointerDown={(e) => {
                      if (e.button === 0) setOpen(false);
                    }}
                  />
                  <div className="relative z-10 flex h-full w-full items-center justify-center p-4 pointer-events-none">
                    <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
                    <motion.div
                      layoutId={layoutId}
                      layout
                      className="relative inline-flex max-h-[90vh] max-w-[min(90vw,80rem)] items-center justify-center overflow-auto rounded-lg p-4 pointer-events-auto"
                      transition={{ layout: layoutSpring }}
                      style={{ willChange: "transform" }}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <SvgHtml html={svg} invert={invert} label={alt} className="[&_svg]:max-h-[90vh]" />
                    </motion.div>
                    <DialogPrimitive.Close
                      type="button"
                      className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground pointer-events-auto absolute top-4 right-4 z-20 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-2 opacity-80 transition-opacity hover:cursor-pointer hover:opacity-100 hover:bg-white/20 focus:ring-2 focus:ring-offset-2 focus:outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0"
                      aria-label="Close diagram"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <XIcon size={16} weight="bold" />
                    </DialogPrimitive.Close>
                  </div>
                </div>
              </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>
        </LayoutGroup>
      ) : (
        <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-50/50 dark:bg-gray-800/25" aria-hidden />
      )}
      {caption && (
        <motion.p
          className="text-sm text-muted-foreground italic text-center max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}
