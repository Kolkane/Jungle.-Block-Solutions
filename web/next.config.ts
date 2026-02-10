import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages compatible static export
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
