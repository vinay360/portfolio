"use client";

import { motion } from "motion/react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function MdxTable({
  headers,
  rows,
  caption,
  className,
}: {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  caption?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("not-prose my-8", className)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {caption ? <p className="mb-3 text-sm font-medium text-muted-foreground">{caption}</p> : null}
      <div className={cn("overflow-hidden rounded-2xl border border-border bg-gray-50/50", "dark:bg-gray-800/25")}>
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {headers.map((h, i) => (
                <TableHead
                  key={i}
                  className="h-12 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-gray-200 dark:bg-background"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, r) => (
              <TableRow key={r} className="border-border hover:bg-muted/40 dark:hover:bg-muted/20">
                {row.map((cell, c) => (
                  <TableCell
                    key={c}
                    className={cn("px-4 py-3 align-top text-foreground whitespace-normal", c === 0 && "font-medium")}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
