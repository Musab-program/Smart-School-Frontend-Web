import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow self-signed localhost API during development
  allowedDevOrigins: [
    "localhost:44363",
    "localhost:3000",
  ],
};

export default nextConfig;
