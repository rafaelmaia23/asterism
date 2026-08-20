import localFont from "next/font/local";

/**
 * The three Observatorio families, loaded from local files.
 *
 * Never from a CDN: the export pipeline rasterizes the DOM, and a font served
 * cross-origin is not inlined during capture — the PDF would come out in Arial.
 * See observatorio-design-system.md, section 12.
 *
 * Each family ships as a single variable file. The declared weight range is the
 * font's real `wght` axis, so any weight the design system asks for resolves
 * without falling back.
 */

/** Display: headings, large numerals, the logo. Weights 600 and 700. */
export const oxanium = localFont({
  src: "./Oxanium-Variable.ttf",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-oxanium",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Body: all running and interface text. Weights 400, 500 and 600. */
export const sora = localFont({
  src: [
    { path: "./Sora-Variable.woff2", weight: "100 800", style: "normal" },
    { path: "./Sora-Italic-Variable.ttf", weight: "100 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-sora",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Utility: code, kickers, counters, metadata. Weights 400 and 500. */
export const jetbrainsMono = localFont({
  src: "./JetBrainsMono-Variable.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["ui-monospace", "monospace"],
});

/** Applied to <html>; every family exposes its CSS variable to the theme. */
export const fontVariables = [
  oxanium.variable,
  sora.variable,
  jetbrainsMono.variable,
].join(" ");
