import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://bis-saathi.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
