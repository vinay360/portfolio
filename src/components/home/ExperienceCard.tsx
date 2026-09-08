"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { TechBadge } from "@/components/home/TechBadge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Experience } from "@/data/experiences";
import { triggerHaptic } from "@/lib/haptics";
import { cn, formatShortDate, formatShortLocation } from "@/lib/utils";

function ExperienceDetails({ experience }: { experience: Experience }) {
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Technologies &amp; Tools</h4>
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((t) => (
            <TechBadge key={t.name} name={t.name}>
              {t.icon}
            </TechBadge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold">What I&apos;ve done</h4>
        <ul className="flex flex-col gap-1 text-sm text-secondary">
          {experience.description.map((line, i) => (
            <li
              key={i}
              className="flex gap-2"
              dangerouslySetInnerHTML={{ __html: `• ${line.replace(/\*(.*?)\*/g, "<b>$1</b>")}` }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkingBadge({ withBorder }: { withBorder?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md border-green-300 bg-green-500/10 px-2 py-1 text-xs",
        withBorder && "border dark:border-green-600",
      )}
    >
      <div className="size-2 rounded-full bg-green-500 animate-pulse" />
      <span>Working</span>
    </div>
  );
}

function Dates({ experience }: { experience: Experience }) {
  const end = experience.isCurrent ? "Present" : experience.endDate;
  return (
    <div className="flex shrink-0 flex-col text-right text-sm text-secondary min-w-[88px] md:min-w-[140px]">
      <p className="md:hidden">
        {formatShortDate(experience.startDate)} – {experience.isCurrent ? "Present" : formatShortDate(experience.endDate)}
      </p>
      <p className="hidden md:block">
        {experience.startDate} – {end}
      </p>
      <p className="md:hidden">{formatShortLocation(experience.location)}</p>
      <p className="hidden md:block">{experience.location}</p>
    </div>
  );
}

/** Full card with details always visible (used on /work). */
export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div>
      <div className="flex flex-row flex-nowrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn("text-lg font-bold", experience.isBlur ? "blur-[5px]" : "blur-none")}>
              {experience.company}
            </h3>
            {experience.isCurrent && <WorkingBadge withBorder />}
          </div>
          <p className="text-sm text-secondary">{experience.position}</p>
        </div>
        <Dates experience={experience} />
      </div>
      <ExperienceDetails experience={experience} />
    </div>
  );
}

/** Collapsible card whose expand button appears on hover (used on the home page). */
export function ExperienceCardExpandable({
  experience,
  defaultOpen = false,
}: {
  experience: Experience;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={(v: boolean) => {
        triggerHaptic("selection");
        setOpen(v);
      }}
    >
      <div className="group/card flex flex-row flex-nowrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn("text-lg font-bold", experience.isBlur ? "blur-[5px]" : "blur-none")}>
              {experience.company}
            </h3>
            {experience.isCurrent && <WorkingBadge />}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className={cn(
                  "shrink-0 text-muted-foreground hover:text-foreground transition-opacity",
                  open ? "opacity-100" : "opacity-0 group-hover/card:opacity-100",
                )}
                aria-label={open ? "Collapse details" : "Expand details"}
              >
                {open ? (
                  <CaretDownIcon className="size-4" weight="bold" aria-hidden />
                ) : (
                  <CaretRightIcon className="size-4" weight="bold" aria-hidden />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-sm text-secondary">{experience.position}</p>
        </div>
        <Dates experience={experience} />
      </div>
      <CollapsibleContent>
        <ExperienceDetails experience={experience} />
      </CollapsibleContent>
    </Collapsible>
  );
}
