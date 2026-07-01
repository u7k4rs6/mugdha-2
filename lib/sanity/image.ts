import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image as SanityImage } from "sanity";
import { projectId, dataset } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Sanity's responsive image URL builder (resize, crop respecting hotspot,
 * auto format). This is the one place that knows how to turn a Sanity
 * image asset into a URL; lib/image.tsx's ContentImage wraps it so
 * components never call it directly, matching Step 2's image helper.
 */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}
