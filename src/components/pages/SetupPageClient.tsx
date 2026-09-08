"use client";

import Link from "next/link";
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadSimpleIcon,
  ExportIcon,
  FileTextIcon,
  GearIcon,
  SlidersIcon,
} from "@phosphor-icons/react";
import { useState, useSyncExternalStore } from "react";

import { SectionHeading, StepNumber } from "@/components/pages/CodeBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { vscodeSettingsJson } from "@/data/setup";
import { triggerHaptic } from "@/lib/haptics";

type Step =
  | { type: "download"; name: string; description: string; href: string }
  | { type: "instruction"; text: string }
  | { type: "shortcut"; text: string }
  | { type: "prompt"; text: string };

type Section = { id: number; title: string; icon: React.ReactNode; content: Step[] };

const sections: Section[] = [
  {
    id: 1,
    title: "Download necessary files",
    icon: <DownloadSimpleIcon className="size-4" />,
    content: [
      { type: "download", name: "Fira-code.zip", description: "Unzip the font's file", href: "/setup/fira-code.zip" },
      { type: "instruction", text: "Select all the fonts, right click, and click to Install" },
      {
        type: "download",
        name: "vsc-extensions.txt",
        description: "Place this file in downloads",
        href: "/setup/vsc-extensions.txt",
      },
      { type: "instruction", text: "Open VSCode / Cursor in downloads directory" },
      { type: "instruction", text: "Install VSC Export & Import extension in VSCode / Cursor." },
    ],
  },
  {
    id: 2,
    title: "Installing all the extensions",
    icon: <FileTextIcon className="size-4" />,
    content: [
      { type: "instruction", text: "Open Command Palette by pressing the keyboard shortcut" },
      { type: "shortcut", text: "Cmd + ⇧ + P (Mac) / Ctrl + ⇧ + P (Windows)" },
      { type: "instruction", text: "Enter the text in prompt and press Enter ⏎" },
      { type: "prompt", text: "VSC Export & Import" },
      { type: "instruction", text: "All extension will start to install" },
    ],
  },
  {
    id: 3,
    title: "VSCode / Cursor Settings",
    icon: <GearIcon className="size-4" />,
    content: [
      { type: "instruction", text: "Open Command Palette by pressing the keyboard shortcut" },
      { type: "shortcut", text: "Cmd + ⇧ + P (Mac) / Ctrl + ⇧ + P (Windows)" },
      { type: "instruction", text: "Enter the text in prompt and press Enter ⏎" },
      { type: "prompt", text: "Preferences: Open Settings (JSON)" },
      { type: "instruction", text: "Copy the settings.json from the below window" },
    ],
  },
];

const subscribe = () => () => {};
const getIsMac = () => typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const getServerIsMac = () => false;

function usePlatform() {
  const isMac = useSyncExternalStore(subscribe, getIsMac, getServerIsMac);
  const getShortcutText = (text: string) => {
    const base = text.split("(")[0].trim();
    return isMac
      ? base.replace(/Cmd/g, "⌘").replace(/Ctrl/g, "⌃").replace(/Alt/g, "⌥").replace(/Shift/g, "⇧")
      : base.replace(/Cmd/g, "Ctrl");
  };
  return { isMac, getShortcutText };
}

/** Light JSON syntax tinting for the settings preview. */
function SettingsLine({ line }: { line: string }) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return <div className="italic text-muted-foreground/60">{line}</div>;
  if (trimmed.includes(":") && trimmed.includes('"')) {
    const [key, ...rest] = line.split(":");
    return (
      <div>
        <span className="font-medium text-secondary">{key}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-muted-foreground">{rest.join(":")}</span>
      </div>
    );
  }
  return <div className="text-muted-foreground">{line}</div>;
}

export function SetupPageClient() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isMac, getShortcutText } = usePlatform();

  const copySettings = async () => {
    try {
      await navigator.clipboard.writeText(vscodeSettingsJson);
      triggerHaptic("success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => (
        <div key={section.id} className="animate-in-up space-y-4" style={{ animationDelay: `${0.05 * sIdx}s` }}>
          <SectionHeading icon={section.icon} title={section.title} />
          <div className="ml-12 flex flex-col gap-4">
            {section.content.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {step.type === "download" && (
                  <Link
                    href={step.href}
                    download
                    className="flex w-fit items-center gap-3 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70 group"
                  >
                    <DownloadSimpleIcon className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{step.name}</span>
                        <ExportIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </Link>
                )}
                {step.type === "instruction" && (
                  <div className="flex items-center gap-2">
                    <StepNumber>
                      {sIdx + 1}.{i + 1}
                    </StepNumber>
                    <p className="ml-4 text-sm text-secondary">{step.text}</p>
                  </div>
                )}
                {step.type === "shortcut" && (
                  <div className="ml-12 flex w-fit items-center justify-start rounded-lg border border-border bg-accent/50 p-3">
                    <span className="text-left text-sm font-medium text-secondary">{getShortcutText(step.text)}</span>
                  </div>
                )}
                {step.type === "prompt" && (
                  <div className="ml-12 flex w-fit items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                    <code className="font-mono text-sm text-secondary">{step.text}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="animate-in-up space-y-4" style={{ animationDelay: `${0.05 * sections.length}s` }}>
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <SectionHeading icon={<SlidersIcon className="size-4" />} title="settings.json" small />
            <CollapsibleTrigger className="flex w-fit items-center justify-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 transition-colors hover:bg-muted/70 sm:justify-start sm:px-4">
              <span className="text-sm font-medium">{open ? "Hide" : "Show"}</span>
              {open ? <CaretUpIcon className="size-4" /> : <CaretDownIcon className="size-4" />}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="ml-12 mt-4">
              <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
                  <span className="text-sm font-medium">settings.json</span>
                  <button
                    onClick={copySettings}
                    type="button"
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <CopyIcon className="size-3" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <pre className="p-4">
                    <code className="block whitespace-pre font-mono text-xs leading-relaxed text-secondary">
                      {vscodeSettingsJson.split("\n").map((line, i) => (
                        <SettingsLine key={i} line={line} />
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="animate-in-up space-y-4" style={{ animationDelay: `${(sections.length + 1) * 0.05}s` }}>
        <SectionHeading icon={<CheckCircleIcon className="size-4 text-secondary" />} title="Complete Setup" />
        <div className="ml-12 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <StepNumber>1</StepNumber>
            <p className="ml-4 text-sm text-secondary">Paste the code in the settings.json file in VSCode / Cursor</p>
          </div>
          <div className="flex items-center gap-2">
            <StepNumber>2</StepNumber>
            <div className="ml-4 flex items-center gap-2">
              <p className="text-sm text-secondary">Save the settings.json file with</p>
              <span className="text-sm font-medium text-secondary">{isMac ? "⌘ + S" : "Ctrl + S"}</span>
              <span className="text-sm text-secondary">and restart VSCode / Cursor</span>
            </div>
          </div>
          <div className="mt-4 flex w-fit items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <CheckCircleIcon className="size-5 text-secondary" />
            <span className="font-medium text-secondary">Done! Your editor is now configured.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
