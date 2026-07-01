import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

/**
 * The read client every page uses. Public project id and dataset only, no
 * token, per /docs/3_SECURITY_AND_ACCESS.md: Sanity read access is safe to
 * expose to the client, so nothing here is a secret even though this file
 * is also imported from Server Components.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * generateStaticParams and any other build-time query that must see the
 * latest content (not the CDN's brief cache lag) should use this instead.
 */
export const uncachedClient = client.withConfig({ useCdn: false });
