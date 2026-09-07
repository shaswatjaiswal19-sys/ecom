// next.config.js – Vercel‑compatible configuration
// This file mirrors the TypeScript config in next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion", "@clerk/nextjs"]
  }
};
module.exports = nextConfig;
