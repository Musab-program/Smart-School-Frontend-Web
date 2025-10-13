import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow self-signed localhost API during development
  experimental: {
    allowedDevOrigins: [
      "https://localhost:44363",
    ],
  },
};

export default nextConfig;
