"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function Todo({
  tasks,
  checked,
  title,
  className,
}: {
  tasks: string[];
  checked?: boolean[];
  title?: string;
  className?: string;
}) {
  const id = useId();
  const [state, setState] = useState<boolean[]>(() =>
    Array.isArray(checked) && checked.length === tasks.length ? [...checked] : tasks.map(() => false),
  );

  const toggle = (i: number) =>
    setState((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  return (
    <motion.div
      className={cn("not-prose my-6", className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {title && <p className="mb-3 text-sm font-medium text-muted-foreground">{title}</p>}
      <ul className="space-y-2 list-none pl-0">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-center gap-3 py-0.5">
            <Checkbox
              id={`${id}-${i}`}
              checked={state[i]}
              onCheckedChange={() => toggle(i)}
              className="shrink-0"
              aria-label={task}
            />
            <label
              htmlFor={`${id}-${i}`}
              className={cn(
                "cursor-pointer select-none text-muted-foreground transition-colors",
                state[i] && "line-through opacity-70",
              )}
            >
              {task}
            </label>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
