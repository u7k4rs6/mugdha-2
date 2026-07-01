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
// report) has no image asset in Sanity; this resolves to "" for it rather
// than throwing, since Saree.image is a required string in the type.
type SanityImageRef = Parameters<typeof urlFor>[0] | null | undefined;
function toImageUrl(image: SanityImageRef, width = 1600): string {
  if (!image) return "";
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

// The one named piece that always closes the "Newly on the loom" rail,
// regardless of fetch order. See /docs and Step 2's note on this.
const NEW_DROP_EXTRA = "Sky Blue Semi Silk Saree Paithani Peacock Border";

/** Homepage "Newly on the loom" rail, in the exact reference order. */
export function getNewDrops(sarees: Saree[]): Saree[] {
  const ordered = sarees.filter((s) => s.isNew && s.name !== NEW_DROP_EXTRA);
  const extra = sarees.find((s) => s.name === NEW_DROP_EXTRA);
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

/** CraftPanel's three heritage weaves: the only fabrics with onLoomDays set. */
export function getHeritageWeaves(fabrics: Fabric[]): Fabric[] {
  return fabrics.filter((f) => f.onLoomDays);
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

export async function getMoodStories(): Promise<MoodStory[]> {
  const raw = await client.fetch<RawMoodStory[]>(
    MOOD_STORIES_QUERY,
    {},
    { next: { tags: ["moodStory"] } },
  );
  return raw.map((m) => ({ ...m, heroImage: toImageUrl(m.heroImage) }));
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
