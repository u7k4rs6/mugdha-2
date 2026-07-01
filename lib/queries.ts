import { defineQuery } from "next-sanity";

// Every projection below returns exactly the shape the interfaces in
// lib/types.ts expect: "id" aliases Sanity's _id, "fabric" aliases the
// referenced fabric's name (a string, like the type), image fields resolve
// to a plain CDN url string (sized via lib/sanity/image.ts's urlFor in
// lib/data.ts, not raw asset objects), matching Step 2's `image: string`
// contract so no component changes.

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    whatsappNumber,
    announcementTicker,
    socialLinks,
    mapsProvider
  }
`);

export const FABRICS_QUERY = defineQuery(`
  *[_type == "fabric"] | order(name asc) {
    "id": _id,
    "slug": slug.current,
    name,
    script,
    story,
    heroImage,
    onLoomDays,
    accentColor
  }
`);

export const SAREES_QUERY = defineQuery(`
  *[_type == "saree"] | order(_createdAt asc) {
    "id": _id,
    "slug": slug.current,
    name,
    "fabric": fabric->name,
    price,
    mrp,
    offerPercent,
    colorFamily,
    borderColour,
    palluMotif,
    image,
    isNew,
    silkMarkCertified,
    description,
    careNotes,
    "storeAvailability": storeAvailability[]->_id
  }
`);

export const MOOD_STORIES_QUERY = defineQuery(`
  *[_type == "moodStory"] | order(colorName asc) {
    "id": _id,
    colorName,
    script,
    subtitle,
    heroImage,
    filterQuery
  }
`);

export const STORES_QUERY = defineQuery(`
  *[_type == "store"] | order(storeCount desc) {
    "id": _id,
    city,
    address,
    "coordinates": { "lat": coordinates.lat, "lng": coordinates.lng },
    storeCount,
    hours,
    mapsUrl
  }
`);

export const BRIDAL_LOOKS_QUERY = defineQuery(`
  *[_type == "bridalLook"] {
    "id": _id,
    ceremony,
    "sareeId": saree->_id,
    image,
    note
  }
`);

export const JOURNAL_POSTS_QUERY = defineQuery(`
  *[_type == "journalPost"] | order(_createdAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    cover,
    body
  }
`);
