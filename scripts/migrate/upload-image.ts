import type { SanityClient } from "@sanity/client";

export interface BrokenImage {
  documentType: string;
  documentName: string;
  sourceUrl: string;
  reason: string;
}

const cache = new Map<string, string>(); // source url -> Sanity asset _id

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
