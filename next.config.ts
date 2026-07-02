import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/groeien", destination: "/vindbaarheid", permanent: true },
      { source: "/automatiseren", destination: "/behoud", permanent: true },
      { source: "/vormgeven", destination: "/bouwen", permanent: true },
      { source: "/acquisitie", destination: "/campagnes", permanent: true },
    ];
  },
};

export default nextConfig;
