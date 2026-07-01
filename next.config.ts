import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Per /docs/3_SECURITY_AND_ACCESS.md: allowlist only approved sources.
    // The Mugdha product photography bucket today, the Sanity CDN once
    // Step 3 lands.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mugdhabk.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
