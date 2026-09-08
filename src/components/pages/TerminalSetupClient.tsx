"use client";

import Link from "next/link";
import {
  ArrowLineUpRightIcon,
  ArrowsClockwiseIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileCodeIcon,
  FolderOpenIcon,
  GithubLogoIcon,
  PackageIcon,
  TerminalIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { CodeBlock, SectionHeading, StepNumber } from "@/components/pages/CodeBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { brewInstallCommand, fastfetchConfig, linuxInstallCommands, zshrcConfig } from "@/data/terminal";
import { triggerHaptic } from "@/lib/haptics";

const prerequisites = [
  {
    name: "Zsh",
    description: "Modern shell (pre-installed on macOS, install on Linux)",
    icon: <TerminalIcon className="size-4" />,
  },
  { name: "Git", description: "Version control system", icon: <FolderOpenIcon className="size-4" /> },
  {
    name: "Homebrew",
    description: "Package manager for macOS/Linux (brew.sh)",
    icon: <PackageIcon className="size-4" />,
  },
];

type Step = { type: "instruction"; text: string } | { type: "code"; text: string };

const steps: { id: number; title: string; icon: React.ReactNode; content: Step[] }[] = [
  {
    id: 1,
    title: "Install Required Packages",
    icon: <DownloadSimpleIcon className="size-4" />,
    content: [
      { type: "instruction", text: "Run this one-liner to install all required packages:" },
      { type: "code", text: brewInstallCommand },
    ],
  },
  {
    id: 2,
    title: "Configure Zsh",
    icon: <FileCodeIcon className="size-4" />,
    content: [
      { type: "instruction", text: "Backup your existing .zshrc (if any):" },
      { type: "code", text: "[ -f ~/.zshrc ] && mv ~/.zshrc ~/.zshrc.backup" },
      { type: "instruction", text: "Create a new .zshrc file and paste the configuration below:" },
      { type: "code", text: "nano ~/.zshrc" },
    ],
  },
  {
    id: 3,
    title: "Configure Fastfetch",
    icon: <FileCodeIcon className="size-4" />,
    content: [
      { type: "instruction", text: "Create the fastfetch config directory:" },
      { type: "code", text: "mkdir -p ~/.config/fastfetch" },
      { type: "instruction", text: "Create the config file:" },
      { type: "code", text: "nano ~/.config/fastfetch/config.jsonc" },
    ],
  },
];

function CollapsibleSection({
  title,
  icon,
  delay,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  delay: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="animate-in-up space-y-4" style={{ animationDelay: `${delay}s` }}>
      <Collapsible
        open={open}
        onOpenChange={(v) => {
          triggerHaptic("selection");
          setOpen(v);
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
          <SectionHeading icon={icon} title={title} small />
          <CollapsibleTrigger className="flex w-fit items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 transition-colors hover:bg-muted/70 sm:px-4">
            <span className="text-sm font-medium">{open ? "Hide" : "Show"}</span>
            {open ? <CaretUpIcon className="size-4" /> : <CaretDownIcon className="size-4" />}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="ml-12 mt-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const inlineCode = "rounded bg-muted px-1.5 py-0.5 text-xs";

export function TerminalSetupClient() {
  return (
    <div className="space-y-8">
      <div className="animate-in-up space-y-4" style={{ animationDelay: "0s" }}>
        <SectionHeading icon={<PackageIcon className="size-4" />} title="Prerequisites" />
        <div className="ml-12 flex flex-col gap-4">
          {prerequisites.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4">
              <StepNumber>{i + 1}</StepNumber>
              <div className="flex items-center gap-3">
                <div className="rounded bg-muted/50 p-1.5">{p.icon}</div>
                <div>
                  <span className="text-sm font-medium text-secondary">{p.name}</span>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CollapsibleSection title="Linux Installation" icon={<TerminalIcon className="size-4" />} delay={0.05}>
        <p className="mb-4 text-sm text-muted-foreground">Install Zsh and dependencies on Linux distributions:</p>
        <CodeBlock code={linuxInstallCommands} title="Linux Package Installation" />
      </CollapsibleSection>

      {steps.map((section, sIdx) => (
        <div key={section.id} className="animate-in-up space-y-4" style={{ animationDelay: `${(sIdx + 2) * 0.05}s` }}>
          <SectionHeading icon={section.icon} title={section.title} />
          <div className="ml-12 flex flex-col gap-4">
            {section.content.map((step, i) => (
              <div key={i}>
                {step.type === "instruction" && (
                  <div className="flex items-center gap-2">
                    <StepNumber>
                      {sIdx + 1}.{i + 1}
                    </StepNumber>
                    <p className="ml-4 text-sm text-secondary">{step.text}</p>
                  </div>
                )}
                {step.type === "code" && (
                  <div className="mt-2">
                    <CodeBlock code={step.text} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <CollapsibleSection
        title=".zshrc Configuration"
        icon={<FileCodeIcon className="size-4" />}
        delay={(steps.length + 2) * 0.05}
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Copy this entire configuration and paste it into your <code className={inlineCode}>~/.zshrc</code> file:
        </p>
        <CodeBlock code={zshrcConfig} title=".zshrc" />
      </CollapsibleSection>

      <CollapsibleSection
        title="Fastfetch Configuration"
        icon={<FileCodeIcon className="size-4" />}
        delay={(steps.length + 3) * 0.05}
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Copy this configuration to <code className={inlineCode}>~/.config/fastfetch/config.jsonc</code>. Replace{" "}
          <code className={inlineCode}>{"{YOUR_USERNAME}"}</code> with your actual username:
        </p>
        <CodeBlock code={fastfetchConfig} title="config.jsonc" />
      </CollapsibleSection>

      <div className="animate-in-up space-y-4" style={{ animationDelay: `${(steps.length + 4) * 0.05}s` }}>
        <SectionHeading icon={<ArrowsClockwiseIcon className="size-4" />} title="Apply Configuration" />
        <div className="ml-12 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <StepNumber>1</StepNumber>
            <p className="ml-4 text-sm text-secondary">Reload your shell configuration:</p>
          </div>
          <CodeBlock code="source ~/.zshrc" />
          <div className="flex items-center gap-2">
            <StepNumber>2</StepNumber>
            <p className="ml-4 text-sm text-secondary">Or simply restart your terminal</p>
          </div>
          <div className="mt-4 flex w-fit items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <CheckCircleIcon className="size-5 text-secondary" />
            <span className="font-medium text-secondary">Done! Your terminal is now configured.</span>
          </div>
        </div>
      </div>

      <div className="animate-in-up space-y-4 pt-4" style={{ animationDelay: `${(steps.length + 5) * 0.05}s` }}>
        <SectionHeading icon={<GithubLogoIcon className="size-4" />} title="Source Repository" />
        <div className="ml-12">
          <Link
            href="https://github.com/vinay360"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("light")}
            className="group flex w-fit items-center gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
          >
            <GithubLogoIcon className="size-6" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">vinay360</span>
                <ArrowLineUpRightIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="text-sm text-muted-foreground">Full configuration files, documentation, and updates</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
