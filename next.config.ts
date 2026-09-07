import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion", "@clerk/nextjs"],
  },
};

export default nextConfig;
