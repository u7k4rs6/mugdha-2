import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Point a Sanity webhook at this route to revalidate the site when content
 * changes (Settings -> API -> Webhooks in sanity.io/manage):
 *
 *   URL:        https://<your-site>/api/revalidate
 *   Dataset:    production (and development, for a preview deploy)
 *   Trigger on: Create, Update, Delete
 *   Filter:     (leave blank, every type is tagged the same as it is fetched)
 *   Projection: { "type": _type }
 *   Secret:     the same value as SANITY_REVALIDATE_SECRET below
 *
 * The secret is never sent to the browser: it only ever lives in this
 * server route and in the webhook's own configuration in Sanity.
 */

type WebhookPayload = { type?: string };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // delay, so the CDN has caught up with the write before we revalidate
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?.type) {
      return new Response("Missing type", { status: 400 });
    }

    revalidateTag(body.type);
    return NextResponse.json({ revalidated: body.type, now: Date.now() });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : String(err), { status: 500 });
  }
}
