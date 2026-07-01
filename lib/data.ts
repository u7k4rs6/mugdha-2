// Local, typed placeholder data. Step 3 replaces this module with the Sanity
// client. Every export here matches a type in /lib/types.ts, so pages can
// swap the import without touching a single component.

import catalogueSeed from "./data/catalogue-seed.json";
import type {
  BridalLook,
  Fabric,
  JournalPost,
  MoodStory,
  PalluMotif,
  Saree,
  SiteSettings,
  Store,
} from "./types";

// ---- brand imagery, fixed assets, not part of the Sanity content model ----

export const HERO_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771829391494__1771829391308__Designer%2520Blend.jpg";
export const BRIDAL_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771307031443__1768832146285__Kora%2520Silk.jpg";

// ---- sarees, mapped from the real 119 product catalogue ----

interface RawProduct {
  name: string;
  price: number;
  mrp: number;
  offer: number;
  color: string;
  fabric: string;
  image: string;
}

const RAW_PRODUCTS = catalogueSeed.products as RawProduct[];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function motifFor(name: string): PalluMotif {
  const n = name.toLowerCase();
  if (n.includes("temple") || n.includes("paithani")) return "temple";
  if (
    n.includes("peacock") ||
    n.includes("bird") ||
    n.includes("swan") ||
    n.includes("crane") ||
    n.includes("deer")
  )
    return "peacock";
  return "buta";
}

// The six newest pieces on the homepage drops rail, picked the same way the
// reference does: skip three names, take the next five in catalogue order,
// then append one named piece.
const NEW_DROP_SKIP = new Set([
  "Rani Pink Georgette Saree Paisley Buttas Elephant Border",
  "Light Gold Pure Silk Saree Rich Diamond Zari Pallu",
  "Lavender Semi Silk Saree Floral Bird Print Blue Border",
]);
const NEW_DROP_EXTRA = "Sky Blue Semi Silk Saree Paithani Peacock Border";

const newDropNames = new Set<string>();
{
  let picked = 0;
  for (const p of RAW_PRODUCTS) {
    if (picked >= 5) break;
    if (NEW_DROP_SKIP.has(p.name.replace(/&amp;/g, "&"))) continue;
    newDropNames.add(p.name);
    picked++;
  }
  newDropNames.add(NEW_DROP_EXTRA);
}

export const sarees: Saree[] = RAW_PRODUCTS.map((p, i) => {
  const name = p.name.replace(/&amp;/g, "&");
  const id = "MUG-" + String(1001 + i);
  return {
    id,
    slug: slugify(name) + "-" + id.toLowerCase(),
    name,
    fabric: p.fabric,
    price: p.price,
    mrp: p.mrp,
    offerPercent: p.offer,
    colorFamily: p.color,
    palluMotif: motifFor(name),
    image: p.image,
    isNew: newDropNames.has(p.name),
    silkMarkCertified: true,
  };
});

export function getSareeById(id: string): Saree | undefined {
  return sarees.find((s) => s.id === id);
}

export function getSareesByFabric(fabricName: string): Saree[] {
  return sarees.filter((s) => s.fabric === fabricName);
}

export function getSareesByColor(colorFamily: string): Saree[] {
  return sarees.filter((s) => s.colorFamily === colorFamily);
}

/** Homepage "Newly on the loom" rail, in the exact reference order. */
export function getNewDrops(): Saree[] {
  const ordered: Saree[] = [];
  for (const s of sarees) {
    if (s.isNew && s.name !== NEW_DROP_EXTRA) ordered.push(s);
  }
  const extra = sarees.find((s) => s.name === NEW_DROP_EXTRA);
  if (extra) ordered.push(extra);
  return ordered;
}

// ---- fabrics: the real catalogue weaves, plus the three heritage weaves ----

const FABRIC_SCRIPTS: Record<string, string> = {
  Georgette: "जॉर्जेट",
  "Semi Silk": "सेमी",
  "Pure Silk": "பட்டு",
  "Mashru Silk": "मश्रू",
  Silk: "पट्टु",
  Satin: "साटन",
  "Khaddi Georgette": "खद्दी",
};

// A couple of catalogue fabrics photograph better from a curated shot than
// the first matching product, same choice the reference makes.
const FABRIC_IMAGE_OVERRIDE: Record<string, string> = {
  "Semi Silk":
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1774610415397__1774610414612__6.jpg",
  "Pure Silk":
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1772447691560__1772447690715__633042_047-213864-1.jpg.jpeg",
};

const CATALOGUE_FABRIC_NAMES = (catalogueSeed.fabricFacets as { name: string }[]).map(
  (f) => f.name,
);

/** Colour name plus swatch hex, for the Finder's colour and border dot chips. */
export const colorFacets = catalogueSeed.colorFacets as {
  name: string;
  swatch: string;
  count: number;
}[];

const catalogueFabrics: Fabric[] = CATALOGUE_FABRIC_NAMES.map((name) => {
  const firstMatch = RAW_PRODUCTS.find((p) => p.fabric === name);
  return {
    id: "fab-" + slugify(name),
    slug: slugify(name),
    name,
    script: FABRIC_SCRIPTS[name],
    heroImage: FABRIC_IMAGE_OVERRIDE[name] ?? firstMatch?.image ?? HERO_IMAGE,
  };
});

const heritageFabrics: Fabric[] = [
  {
    id: "fab-kanchipuram",
    slug: "kanchipuram",
    name: "Kanchipuram",
    script: "காஞ்சி",
    story:
      "Mulberry silk, korvai contrast border, real zari. Three shuttles, one weaver, weeks on the loom.",
    heroImage: HERO_IMAGE,
    onLoomDays: "18 to 30 days",
    accentColor: "#E6128C",
  },
  {
    id: "fab-banarasi",
    slug: "banarasi",
    name: "Banarasi",
    script: "बनारस",
    story:
      "Mughal jaal and meenakari brocade from the lanes of Varanasi. Gold and silver zari floats.",
    heroImage:
      "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771307031443__1768832146285__Kora%2520Silk.jpg",
    onLoomDays: "15 to 25 days",
    accentColor: "#FFB100",
  },
  {
    id: "fab-mysore",
    slug: "mysore",
    name: "Mysore",
    script: "ಮೈಸೂರು",
    story:
      "Feather light pure crepe silk with a soft sheen and a slim gold edge. The everyday drape.",
    heroImage:
      "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771829281068__1771829280886__crepe.jpg",
    onLoomDays: "6 to 10 days",
    accentColor: "#0CA4A5",
  },
];

export const fabrics: Fabric[] = [...catalogueFabrics, ...heritageFabrics];

export function getFabricByName(name: string): Fabric | undefined {
  return fabrics.find((f) => f.name === name);
}

/** Homepage "The house weaves" tiles: top real fabrics by saree count, Satin excluded, same as the reference. */
export function getWeaveGridFabrics(count = 5): Fabric[] {
  return catalogueFabrics.filter((f) => f.name !== "Satin").slice(0, count);
}

/** CraftPanel's three heritage weaves. */
export function getHeritageWeaves(): Fabric[] {
  return heritageFabrics;
}

// ---- mood stories: shop by colour ----

const MOOD_COLORS = ["Pink", "Red", "Yellow", "Blue", "Green", "Purple"];

const MOOD_IMAGE_OVERRIDE: Record<string, string> = {
  Pink: "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1774439658042__1774439657224__6.jpg",
  Yellow:
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1772447691560__1772447690715__633042_047-213864-1.jpg.jpeg",
  Blue: "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1775134990618__1775134989827__6.jpg",
};

export const moodStories: MoodStory[] = MOOD_COLORS.map((color) => {
  const count = RAW_PRODUCTS.filter((p) => p.color === color).length;
  const firstMatch = RAW_PRODUCTS.find((p) => p.color === color);
  return {
    id: "mood-" + slugify(color),
    colorName: color,
    subtitle: `${count} sarees`,
    heroImage: MOOD_IMAGE_OVERRIDE[color] ?? firstMatch?.image ?? HERO_IMAGE,
    filterQuery: { colorFamily: color },
  };
});

// ---- stores ----
// Coordinates are each city's real lat/lng. Addresses are placeholders, the
// real ones per /docs/1_PRD.md section 8 are still needed from Mugdha.

export const stores: Store[] = [
  {
    id: "store-hyderabad",
    city: "Hyderabad",
    address: "Mugdha Art Studio, Banjara Hills, Hyderabad, Telangana 500034, India",
    coordinates: { lat: 17.385, lng: 78.4867 },
    storeCount: 11,
  },
  {
    id: "store-bengaluru",
    city: "Bengaluru",
    address: "Mugdha Art Studio, Indiranagar, Bengaluru, Karnataka 560038, India",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    storeCount: 6,
  },
  {
    id: "store-chennai",
    city: "Chennai",
    address: "Mugdha Art Studio, T Nagar, Chennai, Tamil Nadu 600017, India",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    storeCount: 4,
  },
  {
    id: "store-vijayawada",
    city: "Vijayawada",
    address: "Mugdha Art Studio, MG Road, Vijayawada, Andhra Pradesh 520010, India",
    coordinates: { lat: 16.5062, lng: 80.648 },
    storeCount: 3,
  },
  {
    id: "store-visakhapatnam",
    city: "Visakhapatnam",
    address: "Mugdha Art Studio, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016, India",
    coordinates: { lat: 17.6868, lng: 83.2185 },
    storeCount: 2,
  },
];

// ---- bridal looks ----
// Not rendered on the homepage in the reference (the homepage bridal section
// is one reverent editorial image, no grid), seeded here for the dedicated
// /bridal page a later step builds.

export const bridalLooks: BridalLook[] = [
  {
    id: "bridal-muhurtham",
    ceremony: "Muhurtham",
    sareeId: sarees[0]?.id ?? "",
    image: BRIDAL_IMAGE,
    note: "A Kanchipuram heirloom for the wedding hour itself.",
  },
  {
    id: "bridal-reception",
    ceremony: "Reception",
    sareeId: sarees[1]?.id ?? "",
    image: HERO_IMAGE,
    note: "Rich zari and a bolder colour for the evening.",
  },
  {
    id: "bridal-haldi",
    ceremony: "Haldi",
    sareeId: sarees.find((s) => s.colorFamily === "Yellow")?.id ?? "",
    image:
      "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771651596343__mainImage1771651595918.jpg",
    note: "Turmeric yellow, light enough to move in all morning.",
  },
];

// ---- journal ----
// Not consumed on the homepage yet beyond the footer link label.

export const journalPosts: JournalPost[] = [];

// ---- site settings ----

export const siteSettings: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  announcementTicker: [
    "உத்ஸவ் UTSAV",
    "NEW DROPS EVERY FRIDAY",
    "SILK MARK CERTIFIED",
    "PURE ZARI",
    "ఆర్డర్ ఆన్ వాట్సాప్",
    "WOVEN IN HOUSE",
    "25+ STORES",
  ],
  socialLinks: {
    instagram: undefined,
    whatsapp: undefined,
  },
  mapsProvider: "google",
};
