import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // De dev-indicator komt anders mee in de PNG-export van slides.
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
