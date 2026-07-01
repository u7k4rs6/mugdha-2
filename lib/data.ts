// Sanity-backed data layer. Every function here returns exactly the shape
// defined in /lib/types.ts, the contract every component and page already
// consumes. Step 2's local arrays became async fetches; pages now `await`
// these instead of importing plain constants, but no component changed.

import { client } from "./sanity/client";
import { urlFor } from "./sanity/image";
import {
  BRIDAL_LOOKS_QUERY,
  FABRICS_QUERY,
  JOURNAL_POSTS_QUERY,
  MOOD_STORIES_QUERY,
  SAREES_QUERY,
  SITE_SETTINGS_QUERY,
  STORES_QUERY,
} from "./queries";
import type {
  BridalLook,
  Fabric,
  JournalPost,
  MoodStory,
  Saree,
  SiteSettings,
  Store,
} from "./types";

// Brand imagery (HERO_IMAGE, BRIDAL_IMAGE) moved to lib/brand-images.ts: a
// client component (Hero.tsx) needs HERO_IMAGE, and it must not pull the
// Sanity client (and its server-only read token) into the browser bundle
// just by importing a string constant from this file.

// A saree whose source photo could not be migrated (see the migration
// report) has no image asset in Sanity. An empty string here previously
// produced <img src=""> which browsers resolve against the current page
// URL and render as a broken-image icon, not a graceful placeholder. This
// inline SVG is always loadable (no network request at all) and reads as
// an intentional "photo coming soon" tile instead, in every component
// that uses ZoomImage or a direct <img>, without any of them changing.
const MISSING_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23ECE2D2'/%3E%3Ctext x='200' y='250' font-family='Georgia,serif' font-size='20' fill='%238B7A73' text-anchor='middle' dominant-baseline='middle'%3EPhoto coming soon%3C/text%3E%3C/svg%3E";

type SanityImageRef = Parameters<typeof urlFor>[0] | null | undefined;
function toImageUrl(image: SanityImageRef, width = 1600): string {
  if (!image) return MISSING_IMAGE_PLACEHOLDER;
  return urlFor(image).width(width).fit("max").auto("format").url();
}

// ---- sarees ----

interface RawSaree extends Omit<Saree, "image"> {
  image: SanityImageRef;
}

export async function getSarees(): Promise<Saree[]> {
  const raw = await client.fetch<RawSaree[]>(SAREES_QUERY, {}, { next: { tags: ["saree"] } });
  return raw.map((s) => ({ ...s, image: toImageUrl(s.image) }));
}

export function getSareeById(sarees: Saree[], id: string): Saree | undefined {
  return sarees.find((s) => s.id === id);
}

export function getSareesByFabric(sarees: Saree[], fabricName: string): Saree[] {
  return sarees.filter((s) => s.fabric === fabricName);
}

export function getSareesByColor(sarees: Saree[], colorFamily: string): Saree[] {
  return sarees.filter((s) => s.colorFamily === colorFamily);
}

// The reference's exact "Newly on the loom" sequence, by name. Migrated
// sarees are ordered by _createdAt in the query, but the migration writes
// them with 8-way concurrency, so creation order does not reliably match
// catalogue position; the sequence is pinned here instead, matching Step 2.
const NEW_DROP_ORDER = [
  "Red Georgette Saree Peacock Bird Zari Design",
  "Rani Pink Georgette Saree Floral Jaal Deer Bird Border",
  "Rani Pink Georgette Saree Gold Buttas Bird Zari Border",
  "Pink Georgette Saree Silver Zari Butis Shikargah Border",
  "Shimmer Green Glass Tissue Saree with Delicate Silver Zari Floral Embroidery Pallu",
];
const NEW_DROP_EXTRA = "Sky Blue Semi Silk Saree Paithani Peacock Border";

/** Homepage "Newly on the loom" rail, in the exact reference order. */
export function getNewDrops(sarees: Saree[]): Saree[] {
  const byName = new Map(sarees.map((s) => [s.name, s]));
  const ordered = NEW_DROP_ORDER.map((name) => byName.get(name)).filter((s): s is Saree => Boolean(s));
  const extra = byName.get(NEW_DROP_EXTRA);
  return extra ? [...ordered, extra] : ordered;
}

// ---- fabrics ----

interface RawFabric extends Omit<Fabric, "heroImage"> {
  heroImage: SanityImageRef;
}

export async function getFabrics(): Promise<Fabric[]> {
  const raw = await client.fetch<RawFabric[]>(FABRICS_QUERY, {}, { next: { tags: ["fabric"] } });
  return raw.map((f) => ({ ...f, heroImage: toImageUrl(f.heroImage) }));
}

export function getFabricByName(fabrics: Fabric[], name: string): Fabric | undefined {
  return fabrics.find((f) => f.name === name);
}

// The reference's default active CraftPanel tab is Kanchipuram (the
// component's useState(weaves[0]) picks whichever comes first). The Sanity
// query orders fabrics alphabetically for predictability elsewhere, which
// would default to Banarasi instead, so the canonical order is restored
// here rather than in the query.
const HERITAGE_WEAVE_ORDER = ["Kanchipuram", "Banarasi", "Mysore"];

/** CraftPanel's three heritage weaves: the only fabrics with onLoomDays set, in the reference's tab order. */
export function getHeritageWeaves(fabrics: Fabric[]): Fabric[] {
  return fabrics
    .filter((f) => f.onLoomDays)
    .sort((a, b) => HERITAGE_WEAVE_ORDER.indexOf(a.name) - HERITAGE_WEAVE_ORDER.indexOf(b.name));
}

/** Homepage "The house weaves" tiles: top real fabrics by saree count, Satin and the heritage weaves excluded. */
export function getWeaveGridFabrics(fabrics: Fabric[], sarees: Saree[], count = 5): Fabric[] {
  return fabrics
    .filter((f) => !f.onLoomDays && f.name !== "Satin")
    .map((f) => ({ fabric: f, sareeCount: getSareesByFabric(sarees, f.name).length }))
    .sort((a, b) => b.sareeCount - a.sareeCount)
    .slice(0, count)
    .map((x) => x.fabric);
}

// ---- mood stories ----

interface RawMoodStory extends Omit<MoodStory, "heroImage"> {
  heroImage: SanityImageRef;
}

// The reference's exact "Read by colour" sequence. The query orders
// alphabetically for predictability elsewhere; restored to the reference
// order here, same reasoning as HERITAGE_WEAVE_ORDER above.
const MOOD_COLOR_ORDER = ["Pink", "Red", "Yellow", "Blue", "Green", "Purple"];

export async function getMoodStories(): Promise<MoodStory[]> {
  const raw = await client.fetch<RawMoodStory[]>(
    MOOD_STORIES_QUERY,
    {},
    { next: { tags: ["moodStory"] } },
  );
  return raw
    .map((m) => ({ ...m, heroImage: toImageUrl(m.heroImage) }))
    .sort((a, b) => MOOD_COLOR_ORDER.indexOf(a.colorName) - MOOD_COLOR_ORDER.indexOf(b.colorName));
}

// ---- stores ----

export async function getStores(): Promise<Store[]> {
  return client.fetch<Store[]>(STORES_QUERY, {}, { next: { tags: ["store"] } });
}

// ---- bridal looks ----
// Not rendered on the homepage (the homepage bridal section is one
// reverent editorial image, no grid), fetched here for the dedicated
// /bridal page a later step builds.

interface RawBridalLook extends Omit<BridalLook, "image"> {
  image: SanityImageRef;
}

export async function getBridalLooks(): Promise<BridalLook[]> {
  const raw = await client.fetch<RawBridalLook[]>(
    BRIDAL_LOOKS_QUERY,
    {},
    { next: { tags: ["bridalLook"] } },
  );
  return raw.map((b) => ({ ...b, image: toImageUrl(b.image) }));
}

// ---- journal ----
// Not consumed on the homepage yet beyond the footer link label.

interface RawJournalPost extends Omit<JournalPost, "cover"> {
  cover: SanityImageRef;
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const raw = await client.fetch<RawJournalPost[]>(
    JOURNAL_POSTS_QUERY,
    {},
    { next: { tags: ["journalPost"] } },
  );
  return raw.map((j) => ({ ...j, cover: toImageUrl(j.cover) }));
}

// ---- colour facets ----
// Not a Sanity content type: swatch hexes are a fixed presentation lookup
// (like the PAL/UI colour tokens), counts are derived live from the real
// migrated sarees rather than a separately maintained list.

const SWATCH_BY_COLOR: Record<string, string> = {
  Red: "#9e2a2b",
  Pink: "#d96a96",
  Orange: "#d2691e",
  Yellow: "#d8a33a",
  Green: "#2f6b4f",
  Blue: "#22456e",
  Purple: "#7a5a9e",
  White: "#f0ece3",
  Black: "#1a1a1a",
};

export function getColorFacets(
  sarees: Saree[],
): { name: string; swatch: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const s of sarees) {
    counts.set(s.colorFamily, (counts.get(s.colorFamily) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, swatch: SWATCH_BY_COLOR[name] ?? "#888", count }))
    .sort((a, b) => b.count - a.count);
}

// ---- site settings ----

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await client.fetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ["siteSettings"] } },
  );
  return (
    settings ?? {
      whatsappNumber: "",
      announcementTicker: [],
      mapsProvider: "google",
    }
  );
}
