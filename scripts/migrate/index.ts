/**
 * One-off migration: local placeholder data -> Sanity documents in the
 * development dataset. Idempotent: every document uses a deterministic id
 * and createOrReplace, so re-running this converges instead of duplicating.
 *
 * Usage:
 *   npm run migrate            writes documents and uploads images
 *   npm run migrate -- --dry-run
 *                              writes nothing; checks every source image
 *                              URL and reports what WOULD be created
 *
 * Requires in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN.
 * --dry-run only needs NEXT_PUBLIC_SANITY_PROJECT_ID (no writes, no token).
 * Targets the "development" dataset by default; override with MIGRATE_DATASET.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";
import {
  RAW_PRODUCTS,
  COLOR_FACETS,
  FABRIC_FACET_NAMES,
  HERITAGE_WEAVES,
  MOOD_COLORS,
  MOOD_IMAGE_OVERRIDE,
  STORES,
  FABRIC_SCRIPTS,
  FABRIC_IMAGE_OVERRIDE,
  HERO_IMAGE,
  BRIDAL_IMAGE,
  slugify,
  motifFor,
  computeIsNew,
} from "./source-data";
import { uploadImageAsset, checkImageUrl, type BrokenImage } from "./upload-image";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.MIGRATE_DATASET || "development";

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local. See .env.local.example.");
  process.exit(1);
}
if (!DRY_RUN && !token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN in .env.local. See .env.local.example. (Not needed for --dry-run.)",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token: DRY_RUN ? undefined : token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const report: BrokenImage[] = [];
const counts: Record<string, number> = {};

/** Runs `fn` over `items` with at most `limit` in flight at once. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function filenameFor(url: string): string {
  const last = url.split("/").pop() || "image.jpg";
  return decodeURIComponent(last).slice(0, 200);
}

/**
 * In dry-run mode: only checks the source image is fetchable, writes
 * nothing, returns a placeholder id. In real mode: uploads the image and
 * creates/replaces the document as before.
 */
async function resolveImage(sourceUrl: string, context: { documentType: string; documentName: string }) {
  if (DRY_RUN) {
    const ok = await checkImageUrl(sourceUrl, context, report);
    return ok ? ({ _type: "image" as const, asset: { _type: "reference" as const, _ref: "dry-run" } }) : undefined;
  }
  return uploadImageAsset(client, sourceUrl, filenameFor(sourceUrl), context, report);
}

async function writeDoc(doc: Record<string, unknown> & { _id: string }) {
  if (DRY_RUN) return doc._id;
  await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
  return doc._id;
}

async function migrateFabrics() {
  console.log("\n== Fabrics ==");
  const catalogueFabrics = await mapWithConcurrency(FABRIC_FACET_NAMES, 6, async (name) => {
    const firstMatch = RAW_PRODUCTS.find((p) => p.fabric === name);
    const sourceUrl = FABRIC_IMAGE_OVERRIDE[name] ?? firstMatch?.image ?? HERO_IMAGE;
    const image = await resolveImage(sourceUrl, { documentType: "fabric", documentName: name });
    const id = `fabric-${slugify(name)}`;
    await writeDoc({
      _id: id,
      _type: "fabric",
      name,
      slug: { _type: "slug", current: slugify(name) },
      script: FABRIC_SCRIPTS[name],
      heroImage: image,
    });
    return id;
  });

  const heritageIds = await mapWithConcurrency(HERITAGE_WEAVES, 3, async (w) => {
    const image = await resolveImage(w.heroImage, { documentType: "fabric", documentName: w.name });
    const id = `fabric-${w.slug}`;
    await writeDoc({
      _id: id,
      _type: "fabric",
      name: w.name,
      slug: { _type: "slug", current: w.slug },
      script: w.script,
      story: w.story,
      heroImage: image,
      onLoomDays: w.onLoomDays,
      accentColor: w.accentColor,
    });
    return id;
  });

  counts.fabric = catalogueFabrics.length + heritageIds.length;
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} ${counts.fabric} fabrics.`);
  return { fabricIdByName: Object.fromEntries(FABRIC_FACET_NAMES.map((n, i) => [n, catalogueFabrics[i]])) };
}

async function migrateSarees(fabricIdByName: Record<string, string>) {
  console.log("\n== Sarees ==");
  const isNewSet = computeIsNew();

  const sareeIds = await mapWithConcurrency(RAW_PRODUCTS, 8, async (p, i) => {
    const name = p.name.replace(/&amp;/g, "&");
    const id = `saree-${1001 + i}`;
    const fabricId = fabricIdByName[p.fabric];
    if (!fabricId) {
      throw new Error(`No migrated fabric found for "${p.fabric}" (saree "${name}")`);
    }
    const image = await resolveImage(p.image, { documentType: "saree", documentName: name });
    await writeDoc({
      _id: id,
      _type: "saree",
      name,
      slug: { _type: "slug", current: `${slugify(name)}-${id}` },
      fabric: { _type: "reference", _ref: fabricId },
      price: p.price,
      mrp: p.mrp,
      offerPercent: p.offer,
      colorFamily: p.color,
      palluMotif: motifFor(name),
      image,
      isNew: isNewSet.has(p.name),
      silkMarkCertified: true,
    });
    return { id, name };
  });

  counts.saree = sareeIds.length;
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} ${counts.saree} sarees.`);
  return sareeIds;
}

async function migrateMoodStories() {
  console.log("\n== Mood stories ==");
  await mapWithConcurrency(MOOD_COLORS, 6, async (color) => {
    const count = RAW_PRODUCTS.filter((p) => p.color === color).length;
    const firstMatch = RAW_PRODUCTS.find((p) => p.color === color);
    const sourceUrl = MOOD_IMAGE_OVERRIDE[color] ?? firstMatch?.image ?? HERO_IMAGE;
    const image = await resolveImage(sourceUrl, { documentType: "moodStory", documentName: color });
    const id = `moodStory-${slugify(color)}`;
    await writeDoc({
      _id: id,
      _type: "moodStory",
      colorName: color,
      subtitle: `${count} sarees`,
      heroImage: image,
      filterQuery: { colorFamily: color },
    });
    return id;
  });
  counts.moodStory = MOOD_COLORS.length;
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} ${counts.moodStory} mood stories.`);
}

async function migrateStores() {
  console.log("\n== Stores ==");
  for (const s of STORES) {
    await writeDoc({
      _id: `store-${s.slug}`,
      _type: "store",
      city: s.city,
      address: s.address,
      coordinates: { _type: "geopoint", lat: s.lat, lng: s.lng },
      storeCount: s.storeCount,
    });
  }
  counts.store = STORES.length;
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} ${counts.store} stores.`);
}

async function migrateBridalLooks(sareeIds: { id: string; name: string }[]) {
  console.log("\n== Bridal looks ==");
  const yellowSaree = RAW_PRODUCTS.findIndex((p) => p.color === "Yellow");
  const picks = [
    { slug: "muhurtham", ceremony: "Muhurtham", sareeIndex: 0, image: BRIDAL_IMAGE, note: "A Kanchipuram heirloom for the wedding hour itself." },
    { slug: "reception", ceremony: "Reception", sareeIndex: 1, image: HERO_IMAGE, note: "Rich zari and a bolder colour for the evening." },
    {
      slug: "haldi",
      ceremony: "Haldi",
      sareeIndex: yellowSaree,
      image:
        "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771651596343__mainImage1771651595918.jpg",
      note: "Turmeric yellow, light enough to move in all morning.",
    },
  ];

  let created = 0;
  for (const pick of picks) {
    const saree = sareeIds[pick.sareeIndex];
    if (!saree) continue;
    const image = await resolveImage(pick.image, { documentType: "bridalLook", documentName: pick.ceremony });
    await writeDoc({
      _id: `bridalLook-${pick.slug}`,
      _type: "bridalLook",
      ceremony: pick.ceremony,
      saree: { _type: "reference", _ref: saree.id },
      image,
      note: pick.note,
    });
    created++;
  }
  counts.bridalLook = created;
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} ${counts.bridalLook} bridal looks.`);
}

async function migrateSiteSettings() {
  console.log("\n== Site settings ==");
  await writeDoc({
    _id: "siteSettings",
    _type: "siteSettings",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    announcementTicker: [
      "உத்ஸவ் UTSAV",
      "NEW DROPS EVERY FRIDAY",
      "SILK MARK CERTIFIED",
      "PURE ZARI",
      "ఆర్డర్ ఆన్ వాట్సాప్",
      "WOVEN IN HOUSE",
      "25+ STORES",
    ],
    mapsProvider: "google",
  });
  console.log(`${DRY_RUN ? "Would create/update" : "Created/updated"} siteSettings.`);
  if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
    console.log(
      "  NEXT_PUBLIC_WHATSAPP_NUMBER was not set, whatsappNumber would be blank. Set it in Studio or .env.local and rerun.",
    );
  }
}

async function main() {
  console.log(DRY_RUN ? "== DRY RUN: nothing will be written ==" : "== LIVE RUN ==");
  console.log(`Target dataset "${dataset}" on project "${projectId}".`);
  console.log(`Colour facets available for reference: ${COLOR_FACETS.map((c) => c.name).join(", ")}`);

  const { fabricIdByName } = await migrateFabrics();
  const sareeIds = await migrateSarees(fabricIdByName);
  await migrateMoodStories();
  await migrateStores();
  await migrateBridalLooks(sareeIds);
  await migrateSiteSettings();

  console.log("\n== Summary ==");
  console.log(DRY_RUN ? "(dry run, nothing was written)" : "(written)");
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type}: ${count}`);
  }

  const label = DRY_RUN ? "Images that would fail to migrate" : "Images that need resupplying";
  if (report.length) {
    console.log(`\n== ${label} (${report.length}) ==`);
    console.log(
      DRY_RUN
        ? "These source photos could not be fetched; on a real run, that document would be created without an image:"
        : "These documents were created without an image because the source photo could not be fetched:",
    );
    for (const item of report) {
      console.log(`  [${item.documentType}] ${item.documentName}`);
      console.log(`    source: ${item.sourceUrl}`);
      console.log(`    reason: ${item.reason}`);
    }
  } else {
    console.log(`\nAll images ${DRY_RUN ? "are" : "uploaded successfully,"} reachable, nothing to resupply.`);
  }
}

main().catch((err) => {
  console.error(`\n${DRY_RUN ? "Dry run" : "Migration"} failed:`, err);
  process.exit(1);
});
