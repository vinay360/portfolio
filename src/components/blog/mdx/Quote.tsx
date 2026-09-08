"use client";

import { motion } from "motion/react";

export function MdxQuote({
  children,
  by,
  designation,
}: {
  children: React.ReactNode;
  by: string;
  designation?: string;
}) {
  return (
    <motion.div
      className="not-prose my-12 flex flex-col items-start"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <blockquote className="text-left border-l-0">
        <div className="relative mb-6 pl-0 flex items-start gap-2 md:gap-3 text-left text-2xl md:text-3xl font-serif text-foreground leading-tight">
          <span className="inline-block shrink-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none text-current select-none">
            “
          </span>
          <span className="inline-block leading-tight flex-1">{children}</span>
          <span className="inline-block shrink-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none text-current select-none self-end">
            ”
          </span>
        </div>
      </blockquote>
      <div className="ml-auto flex w-full items-center gap-2 md:w-[50%]">
        <div className="hidden h-px flex-grow bg-gray-400 md:block" />
        <div className="flex flex-col md:ml-auto md:text-right">
          <span className="text-sm font-medium leading-none no-underline opacity-[0.95]">
            {by}
            <span className="mt-1 block text-muted-foreground md:mt-0 md:inline">
              <span className="hidden md:inline-block">, </span> {designation}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
