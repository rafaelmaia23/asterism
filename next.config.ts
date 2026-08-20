import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app is single-user and runs entirely in the browser (context doc, s.4).
  // Static export from the start makes any accidental use of a server feature
  // fail at build time instead of at deploy time.
  output: "export",
};

export default nextConfig;
