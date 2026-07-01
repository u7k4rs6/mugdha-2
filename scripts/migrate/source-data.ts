// The local placeholder data Step 2 built, kept here so the migration
// script has a stable, standalone source to read from once lib/data.ts
// itself becomes Sanity-backed. This file is not imported by the app.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface RawProduct {
  name: string;
  price: number;
  mrp: number;
  offer: number;
  color: string;
  fabric: string;
  image: string;
}

interface CatalogueSeed {
  products: RawProduct[];
  colorFacets: { name: string; swatch: string; count: number }[];
  fabricFacets: { name: string; count: number }[];
}

const catalogueSeed: CatalogueSeed = JSON.parse(
  readFileSync(path.join(__dirname, "../../lib/data/catalogue-seed.json"), "utf8"),
);

export const RAW_PRODUCTS = catalogueSeed.products;
export const COLOR_FACETS = catalogueSeed.colorFacets;
export const FABRIC_FACET_NAMES = catalogueSeed.fabricFacets.map((f) => f.name);

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type PalluMotif = "peacock" | "buta" | "temple";

export function motifFor(name: string): PalluMotif {
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

// The six newest pieces on the homepage drops rail: skip three names, take
// the next five in catalogue order, then append one named piece. Matches
// the reference exactly, see reference/Mugdha.dc.html's dropSkip/s15.
const NEW_DROP_SKIP = new Set([
  "Rani Pink Georgette Saree Paisley Buttas Elephant Border",
  "Light Gold Pure Silk Saree Rich Diamond Zari Pallu",
  "Lavender Semi Silk Saree Floral Bird Print Blue Border",
]);
export const NEW_DROP_EXTRA = "Sky Blue Semi Silk Saree Paithani Peacock Border";

export function computeIsNew(): Set<string> {
  const newDropNames = new Set<string>();
  let picked = 0;
  for (const p of RAW_PRODUCTS) {
    if (picked >= 5) break;
    if (NEW_DROP_SKIP.has(p.name.replace(/&amp;/g, "&"))) continue;
    newDropNames.add(p.name);
    picked++;
  }
  newDropNames.add(NEW_DROP_EXTRA);
  return newDropNames;
}

export const HERO_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771829391494__1771829391308__Designer%2520Blend.jpg";
export const BRIDAL_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771307031443__1768832146285__Kora%2520Silk.jpg";

export const FABRIC_SCRIPTS: Record<string, string> = {
  Georgette: "जॉर्जेट",
  "Semi Silk": "सेमी",
  "Pure Silk": "பட்டு",
  "Mashru Silk": "मश्रू",
  Silk: "पट्टु",
  Satin: "साटन",
  "Khaddi Georgette": "खद्दी",
};

export const FABRIC_IMAGE_OVERRIDE: Record<string, string> = {
  "Semi Silk":
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1774610415397__1774610414612__6.jpg",
  "Pure Silk":
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1772447691560__1772447690715__633042_047-213864-1.jpg.jpeg",
};

export interface HeritageWeaveSeed {
  slug: string;
  name: string;
  script: string;
  story: string;
  heroImage: string;
  onLoomDays: string;
  accentColor: string;
}

export const HERITAGE_WEAVES: HeritageWeaveSeed[] = [
  {
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

export const MOOD_COLORS = ["Pink", "Red", "Yellow", "Blue", "Green", "Purple"];

export const MOOD_IMAGE_OVERRIDE: Record<string, string> = {
  Pink: "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1774439658042__1774439657224__6.jpg",
  Yellow:
    "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1772447691560__1772447690715__633042_047-213864-1.jpg.jpeg",
  Blue: "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1775134990618__1775134989827__6.jpg",
};

export interface StoreSeed {
  slug: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  storeCount: number;
}

// Coordinates are each city's real lat/lng. Addresses are placeholders,
// the real ones per /docs/1_PRD.md section 8 are still needed from Mugdha.
export const STORES: StoreSeed[] = [
  {
    slug: "hyderabad",
    city: "Hyderabad",
    address: "Mugdha Art Studio, Banjara Hills, Hyderabad, Telangana 500034, India",
    lat: 17.385,
    lng: 78.4867,
    storeCount: 11,
  },
  {
    slug: "bengaluru",
    city: "Bengaluru",
    address: "Mugdha Art Studio, Indiranagar, Bengaluru, Karnataka 560038, India",
    lat: 12.9716,
    lng: 77.5946,
    storeCount: 6,
  },
  {
    slug: "chennai",
    city: "Chennai",
    address: "Mugdha Art Studio, T Nagar, Chennai, Tamil Nadu 600017, India",
    lat: 13.0827,
    lng: 80.2707,
    storeCount: 4,
  },
  {
    slug: "vijayawada",
    city: "Vijayawada",
    address: "Mugdha Art Studio, MG Road, Vijayawada, Andhra Pradesh 520010, India",
    lat: 16.5062,
    lng: 80.648,
    storeCount: 3,
  },
  {
    slug: "visakhapatnam",
    city: "Visakhapatnam",
    address: "Mugdha Art Studio, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016, India",
    lat: 17.6868,
    lng: 83.2185,
    storeCount: 2,
  },
];
