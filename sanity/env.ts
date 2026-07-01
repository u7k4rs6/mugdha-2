// Single source of truth for Sanity connection settings, read by both the
// embedded Studio (sanity.config.ts) and the app's read client
// (lib/sanity/client.ts). Project id and dataset are safe to expose to the
// client per /docs/3_SECURITY_AND_ACCESS.md, so both are NEXT_PUBLIC_.

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
