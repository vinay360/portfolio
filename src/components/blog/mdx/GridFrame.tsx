"use client";

/** Dotted-grid backdrop used behind images and diagrams. */
export function GridPattern() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-2xl dark:opacity-0 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.85))]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(148 163 184 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.5) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 dark:opacity-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.15),rgba(255,255,255,0.5))]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0",
        }}
        aria-hidden
      />
    </>
  );
}

export function FrameBorder() {
  return <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl dark:border-white/5" />;
}
