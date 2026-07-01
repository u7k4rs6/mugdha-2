import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Per /docs/3_SECURITY_AND_ACCESS.md: allowlist only approved sources.
    // Every image now comes from the Sanity CDN (Step 3's migration
    // uploaded the product photography there), so the old direct S3
    // bucket domain is no longer needed here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
