/** Responsive image helpers for blog assets. */
export function buildClientResponsiveImageSets(src: string) {
  const base = src.replace(/\.[^.]+$/, "");
  return {
    pngSrcSet: `${base}-mobile.png 640w, ${base}-tablet.png 1024w, ${base}.png`,
    webpSrcSet: `${base}-mobile.webp 640w, ${base}-tablet.webp 1024w, ${base}.webp`,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw",
  };
}

export const inViewProps = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export const inViewPropsSmall = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export const layoutSpring = { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.3 };
