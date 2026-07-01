import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

/**
 * The read client every Server Component uses. The development (and
 * production) dataset is private, so every read must authenticate: Sanity's
 * CDN cannot serve authenticated reads at all, which is why useCdn is false
 * here, not just a performance choice. Caching and instant revalidation
 * come entirely from Next's own fetch cache (the `next: { tags }` option
 * passed at each call site in lib/data.ts) plus /api/revalidate, not from
 * Sanity's CDN.
 *
 * SANITY_API_READ_TOKEN is server-only (no NEXT_PUBLIC_ prefix) and must
 * stay that way. This file is only ever imported by lib/data.ts, which in
 * turn is only imported by Server Components (see the check in lib/data.ts's
 * own comment); never import this file, or anything that imports it, from
 * a "use client" component; doing so would bundle the token into the
 * browser. Visitors never talk to Sanity directly, only to pre-rendered
 * Next.js pages.
 *
 * A private dataset does not reject an unauthenticated query with an error:
 * it silently returns empty results, since Sanity treats "no access" the
 * same as "nothing there" rather than confirming the data's existence. That
 * means a missing or revoked token would not throw here, it would just
 * render an empty homepage with no error anywhere, so the token's presence
 * is asserted up front instead, matching sanity/env.ts's own pattern for
 * projectId and dataset.
 */
const readToken = assertValue(
  process.env.SANITY_API_READ_TOKEN,
  "Missing environment variable: SANITY_API_READ_TOKEN (required: the dataset is private, an unauthenticated read returns empty results, not an error)",
);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn: false,
});

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
