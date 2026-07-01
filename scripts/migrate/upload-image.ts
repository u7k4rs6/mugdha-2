import type { SanityClient } from "@sanity/client";

export interface BrokenImage {
  documentType: string;
  documentName: string;
  sourceUrl: string;
  reason: string;
}

const cache = new Map<string, string>(); // source url -> Sanity asset _id
const checkCache = new Map<string, boolean>(); // source url -> reachable, for dry-run

/**
 * Dry-run only: checks whether a source image is fetchable without
 * downloading it or writing anything to Sanity. Tries HEAD first (cheap),
 * falls back to a GET whose body is aborted immediately if the host
 * rejects HEAD (some S3 configurations do).
 */
export async function checkImageUrl(
  sourceUrl: string,
  context: { documentType: string; documentName: string },
  report: BrokenImage[],
): Promise<boolean> {
  const cached = checkCache.get(sourceUrl);
  if (cached !== undefined) return cached;

  const recordFailure = (reason: string) => {
    report.push({ documentType: context.documentType, documentName: context.documentName, sourceUrl, reason });
    checkCache.set(sourceUrl, false);
    return false;
  };

  try {
    const head = await fetch(sourceUrl, { method: "HEAD" });
    if (head.ok) {
      checkCache.set(sourceUrl, true);
      return true;
    }
    if (head.status !== 405 && head.status !== 501) {
      return recordFailure(`HTTP ${head.status}`);
    }
    // Host does not support HEAD, retry with GET and abort after headers.
    const controller = new AbortController();
    const res = await fetch(sourceUrl, { signal: controller.signal });
    controller.abort();
    if (!res.ok) return recordFailure(`HTTP ${res.status}`);
    checkCache.set(sourceUrl, true);
    return true;
  } catch (err) {
    return recordFailure(err instanceof Error ? err.message : String(err));
  }
}

/**
 * Fetches a source image and uploads it to Sanity as an asset, so images
 * live on the Sanity CDN and cannot hotlink-403 the way the original S3
 * bucket does for one product. Failures here do not throw: the caller gets
 * `undefined` back and should create the document without an image field,
 * and the failure is pushed onto `report` for the end-of-run summary.
 */
export async function uploadImageAsset(
  client: SanityClient,
  sourceUrl: string,
  filename: string,
  context: { documentType: string; documentName: string },
  report: BrokenImage[],
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined> {
  const cached = cache.get(sourceUrl);
  if (cached) {
    return { _type: "image", asset: { _type: "reference", _ref: cached } };
  }

  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) {
      report.push({
        documentType: context.documentType,
        documentName: context.documentName,
        sourceUrl,
        reason: `HTTP ${res.status}`,
      });
      return undefined;
    }
    const arrayBuffer = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(arrayBuffer), {
      filename,
    });
    cache.set(sourceUrl, asset._id);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    report.push({
      documentType: context.documentType,
      documentName: context.documentName,
      sourceUrl,
      reason: err instanceof Error ? err.message : String(err),
    });
    return undefined;
  }
}
