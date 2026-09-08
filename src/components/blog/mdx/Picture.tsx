"use client";

import { XIcon } from "@phosphor-icons/react";
import { LayoutGroup, motion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useId, useState } from "react";

import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { FrameBorder, GridPattern } from "./GridFrame";
import { buildClientResponsiveImageSets, inViewProps, layoutSpring } from "./image-sets";

type PictureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
};

const closeButtonClass =
  "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground pointer-events-auto absolute top-4 right-4 z-20 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 p-2 opacity-80 transition-opacity hover:cursor-pointer hover:opacity-100 hover:bg-white/20 focus:ring-2 focus:ring-offset-2 focus:outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0";

/** Framed picture with caption; click to open a shared-layout zoom overlay. */
export function Picture({ src, alt, caption, width = 800, height = 400, className = "", ...rest }: PictureProps) {
  const [open, setOpen] = useState(false);
  const layoutId = useId();
  const { pngSrcSet, webpSrcSet, sizes } = buildClientResponsiveImageSets(src);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const webp = `${src.replace(/\.[^.]+$/, "")}.webp`;

  return (
    <motion.div className="my-8 flex flex-col items-center gap-2" {...inViewProps}>
      <LayoutGroup>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="p-4 not-prose relative cursor-pointer bg-gray-50/50 rounded-2xl overflow-hidden dark:bg-gray-800/25">
              <GridPattern />
              <div className="relative rounded-xl overflow-hidden flex justify-center p-2">
                <motion.div
                  className="relative overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
                >
                  {open ? (
                    <picture>
                      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
                      <source srcSet={pngSrcSet} sizes={sizes} type="image/png" />
                      <img
                        src={src}
                        alt=""
                        width={width}
                        height={height}
                        className={cn("rounded-lg max-h-92 w-auto justify-self-center opacity-0", className)}
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    <motion.div
                      layoutId={layoutId}
                      layout
                      className="relative overflow-hidden rounded-lg"
                      transition={{ layout: layoutSpring }}
                      style={{ willChange: "transform" }}
                    >
                      <picture>
                        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
                        <source srcSet={pngSrcSet} sizes={sizes} type="image/png" />
                        <motion.img
                          src={src}
                          alt={alt}
                          width={width}
                          height={height}
                          className={cn("rounded-lg max-h-92 w-auto justify-self-center", className)}
                          {...inViewProps}
                          {...rest}
                        />
                      </picture>
                    </motion.div>
                  )}
                </motion.div>
              </div>
              <FrameBorder />
            </div>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay
              className="backdrop-blur-md bg-black/60"
              onPointerDown={(e) => {
                if (e.button === 0) setOpen(false);
              }}
            />
            <DialogPrimitive.Content
              className={cn(
                "fixed inset-0 z-51 border-none bg-transparent p-0 shadow-none outline-none",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0",
              )}
              onEscapeKeyDown={() => setOpen(false)}
              asChild
            >
              <div className="fixed inset-0 outline-none">
                <div
                  role="presentation"
                  className="absolute inset-0 z-0 bg-transparent"
                  aria-hidden
                  onPointerDown={(e) => {
                    if (e.button === 0) setOpen(false);
                  }}
                />
                <div className="relative z-10 flex h-full w-full items-center justify-center p-4 pointer-events-none">
                  <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
                  <motion.div
                    layoutId={layoutId}
                    layout
                    className="relative inline-flex max-h-[90vh] max-w-[min(90vw,80rem)] items-center justify-center overflow-hidden rounded-lg pointer-events-auto"
                    transition={{ layout: layoutSpring }}
                    style={{ willChange: "transform" }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <picture>
                      <source srcSet={webp} type="image/webp" />
                      <img
                        src={src}
                        alt={alt}
                        className="max-h-[90vh] max-w-full object-contain"
                        loading="eager"
                        decoding="async"
                        style={{ userSelect: "none" }}
                      />
                    </picture>
                  </motion.div>
                  <DialogPrimitive.Close
                    type="button"
                    className={closeButtonClass}
                    aria-label="Close image"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <XIcon size={16} weight="bold" />
                  </DialogPrimitive.Close>
                </div>
              </div>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      </LayoutGroup>
      {caption && (
        <motion.p
          className="text-sm text-muted-foreground italic text-center max-w-2xl "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Plain markdown image (`![]()`), also zoomable. */
export function MdxImage({
  src,
  alt,
  width = 800,
  height = 400,
  className = "",
  ...rest
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const layoutId = useId();
  const { pngSrcSet, webpSrcSet, sizes } = buildClientResponsiveImageSets(src);

  const onOpenChange = (next: boolean) => {
    if (!next && open) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 300);
    } else {
      setOpen(next);
    }
  };

  return (
    <Dialog open={open || closing} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="p-4 not-prose relative bg-gray-50/50 rounded-2xl overflow-hidden dark:bg-gray-800/25">
          <GridPattern />
          <div className="relative rounded-xl overflow-hidden flex justify-center p-2">
            <motion.div
              className="relative cursor-pointer overflow-hidden rounded-lg"
              layoutId={layoutId}
              layout
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ layout: layoutSpring, scale: { type: "spring", stiffness: 400, damping: 25 } }}
              style={{ willChange: "transform", originX: 0.5, originY: 0.5 }}
            >
              <picture>
                <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
                <source srcSet={pngSrcSet} sizes={sizes} type="image/png" />
                <motion.img
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className={`rounded-lg ${className}`}
                  {...inViewProps}
                  {...rest}
                />
              </picture>
            </motion.div>
          </div>
          <FrameBorder />
        </div>
      </DialogTrigger>
      <DialogPortal>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <DialogOverlay className="backdrop-blur-md bg-black/60" />
            </motion.div>
            <DialogPrimitive.Content
              className="bg-transparent fixed top-[50%] left-[50%] z-50 w-[calc(100%-2rem)] max-w-7xl translate-x-[-50%] translate-y-[-50%] p-4 shadow-none border-none pointer-events-none"
              onOpenAutoFocus={(e) => e.preventDefault()}
              asChild
            >
              <motion.div className="flex items-center justify-center pointer-events-auto" key="content">
                <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
                <motion.div
                  className="relative flex items-center justify-center h-[90vh] w-[90vw] max-w-7xl rounded-lg overflow-hidden"
                  layoutId={layoutId}
                  layout
                  transition={layoutSpring}
                  style={{ willChange: "transform", originX: 0.5, originY: 0.5 }}
                >
                  <picture>
                    <source srcSet={`${src.replace(/\.[^.]+$/, "")}.webp`} type="image/webp" />
                    <img
                      src={src}
                      alt={alt}
                      className="h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    />
                  </picture>
                </motion.div>
                <DialogPrimitive.Close
                  className={`${closeButtonClass} absolute top-4 right-4 z-50`}
                  aria-label="Close image"
                >
                  <XIcon size={16} weight="bold" />
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </>
        )}
      </DialogPortal>
    </Dialog>
  );
}
