// Content model, locked from /docs/2_TECHNICAL_ARCHITECTURE.md section 3.
// Every component consumes these. Step 3 swaps /lib/data.ts for the Sanity
// client without changing a single component.

export type PalluMotif = "peacock" | "buta" | "temple";

export interface Fabric {
  id: string;
  slug: string;
  name: string;
  /** A single decorative script glyph, Tamil, Telugu or Devanagari. Not translated, ornamental only. */
  script?: string;
  story?: string;
  heroImage: string;
  /** Only set on the three heritage weaves shown in CraftPanel. */
  onLoomDays?: string;
  /** Only set on the three heritage weaves: the script glyph's colour. */
  accentColor?: string;
}

export interface Saree {
  id: string;
  slug: string;
  name: string;
  /** References Fabric.name. */
  fabric: string;
  price: number;
  mrp: number;
  offerPercent: number;
  colorFamily: string;
  borderColour?: string;
  palluMotif: PalluMotif;
  image: string;
  isNew?: boolean;
  silkMarkCertified?: boolean;
  description?: string;
  careNotes?: string;
  /** References Store.id. */
  storeAvailability?: string[];
}

export interface MoodStory {
  id: string;
  colorName: string;
  script?: string;
  subtitle: string;
  heroImage: string;
  filterQuery: { colorFamily: string };
}

export interface Store {
  id: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  storeCount: number;
  hours?: string;
  mapsUrl?: string;
}

export interface BridalLook {
  id: string;
  ceremony: string;
  /** References Saree.id. */
  sareeId: string;
  image: string;
  note: string;
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover: string;
  body?: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  announcementTicker: string[];
  socialLinks?: { instagram?: string; whatsapp?: string };
  mapsProvider?: "google" | "mapbox";
}
