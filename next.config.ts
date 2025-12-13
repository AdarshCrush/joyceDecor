import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    // Ignore ESLint errors in production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors in production build  
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
