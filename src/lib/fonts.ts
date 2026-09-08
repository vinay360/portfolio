import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

/** Serif face used for blog titles and headings. */
export const blogHeadingFont = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** Monospace face used inside code blocks. */
export const codeFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});
