"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { Separator } from "@/components/ui/separator";

const config = {
  repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO ?? "vinay360/pf",
  label: process.env.NEXT_PUBLIC_UTTERANCES_LABEL ?? "",
  theme: { light: "github-light", dark: "github-dark" },
};

/** GitHub-issue backed comments via utterances. */
export function BlogComments({ term }: { term: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? config.theme.dark : config.theme.light;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", config.repo);
    script.setAttribute("issue-term", term);
    script.setAttribute("issue-mapping", "specific");
    script.setAttribute("theme", theme);
    if (config.label) script.setAttribute("label", config.label);
    el.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  useEffect(() => {
    const frame = ref.current?.querySelector<HTMLIFrameElement>(".utterances-frame");
    frame?.contentWindow?.postMessage({ type: "set-theme", theme }, "https://utteranc.es");
  }, [theme]);

  return (
    <section className="not-prose space-y-6" aria-label="Comments">
      <Separator />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Comments</h2>
      </div>
      <div ref={ref} className="blog-comments" />
    </section>
  );
}
