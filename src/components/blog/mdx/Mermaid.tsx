"use client";

import { XIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useId, useMemo, useState } from "react";

import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const darkVars = {
  darkMode: true,
  background: "transparent",
  primaryColor: "#1f2937",
  primaryBorderColor: "#60a5fa",
  primaryTextColor: "#e5e7eb",
  secondaryColor: "#111827",
  tertiaryColor: "#0b1220",
  lineColor: "#9ca3af",
  nodeBorder: "#60a5fa",
  nodeTextColor: "#e5e7eb",
  textColor: "#e5e7eb",
  edgeLabelBackground: "#111827",
  clusterBkg: "#0f172a",
  clusterBorder: "#475569",
};

const lightVars = {
  darkMode: false,
  background: "transparent",
  primaryColor: "#e0f2fe",
  primaryBorderColor: "#0284c7",
  primaryTextColor: "#0f172a",
  secondaryColor: "#f8fafc",
  tertiaryColor: "#ffffff",
  lineColor: "#334155",
  nodeBorder: "#0284c7",
  nodeTextColor: "#0f172a",
  textColor: "#0f172a",
  edgeLabelBackground: "#ffffff",
  clusterBkg: "#f8fafc",
  clusterBorder: "#cbd5e1",
};

function fixDarkStrokes(svg: string, code: string, dark: boolean) {
  if (!dark) return svg;
  const kind = code.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (kind !== "mindmap" && kind !== "architecture-beta") return svg;
  return svg
    .replace(/stroke:\s*#(?:000|000000|111|111111|222|222222)\b/gi, "stroke:#94a3b8")
    .replace(/stroke="(?:#(?:000|000000|111|111111|222|222222)|black)"/gi, 'stroke="#94a3b8"')
    .replace(/fill="(?:#(?:000|000000|111|111111)|black)"/gi, 'fill="#cbd5e1"');
}

export function Mermaid({ code, children, className }: { code?: string; children?: React.ReactNode; className?: string }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const reactId = useId();
  const baseId = useMemo(() => `mermaid-${reactId.replace(/[^a-zA-Z0-9-_]/g, "")}`, [reactId]);
  const source = useMemo(() => String(code ?? children ?? "").trim(), [code, children]);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    (async () => {
      try {
        setError("");
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: dark ? darkVars : lightVars,
        });
        const { svg: rendered } = await mermaid.render(`${baseId}-${Date.now()}`, source);
        if (cancelled) return;
        const styled = rendered.includes("<svg style=")
          ? rendered.replace(
              /<svg style="([^"]*)"/,
              (_m, s: string) => `<svg style="${s};max-width:100%;height:auto;display:block;margin:0 auto"`,
            )
          : rendered.replace("<svg", '<svg style="max-width:100%;height:auto;display:block;margin:0 auto"');
        setSvg(fixDarkStrokes(styled, source, dark));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to render diagram.");
        setSvg("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source, dark, baseId]);

  return (
    <div className={cn("not-prose my-10 w-full", className)}>
      <div className="w-full overflow-x-auto">
        {!source ? (
          <pre className="whitespace-pre-wrap text-sm text-destructive">No diagram source provided.</pre>
        ) : error ? (
          <pre className="whitespace-pre-wrap text-sm text-destructive">{error}</pre>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full cursor-zoom-in select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open diagram"
              >
                <div
                  aria-label="Mermaid diagram"
                  className="mx-auto w-full min-w-fit max-h-136 overflow-auto select-none [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:max-h-128 [&_svg]:select-none [&_svg_*]:select-none"
                  style={{ userSelect: "none", WebkitUserSelect: "none" }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  role="img"
                />
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay className="z-70 backdrop-blur-md bg-black/60" />
              <DialogPrimitive.Content
                className="fixed inset-0 z-80 border-none bg-transparent p-6 shadow-none outline-none"
                asChild
              >
                <div className="flex h-full w-full items-center justify-center">
                  <DialogPrimitive.Title className="sr-only">Expanded diagram</DialogPrimitive.Title>
                  <div className="flex h-full w-full items-center justify-center overflow-auto">
                    <div
                      className="mx-auto min-w-0 w-[min(95vw,84rem)] select-none bg-transparent [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-h-[88vh] [&>svg]:max-w-full [&_svg]:select-none [&_svg_*]:select-none"
                      style={{ userSelect: "none", WebkitUserSelect: "none" }}
                      dangerouslySetInnerHTML={{ __html: svg }}
                      role="img"
                      aria-label="Expanded mermaid diagram"
                    />
                  </div>
                  <DialogPrimitive.Close
                    type="button"
                    aria-label="Close diagram"
                    className="pointer-events-auto absolute top-4 right-4 z-20 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-2 opacity-80 transition-opacity hover:opacity-100 hover:bg-white/20"
                  >
                    <XIcon size={16} weight="bold" className="text-white" />
                  </DialogPrimitive.Close>
                </div>
              </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>
        )}
      </div>
    </div>
  );
}
