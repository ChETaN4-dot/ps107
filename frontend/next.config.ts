import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error Next.js 16 option
  agentRules: false,
};

export default nextConfig;
