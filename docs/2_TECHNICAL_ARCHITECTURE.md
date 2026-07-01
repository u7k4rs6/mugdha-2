# Mugdha Digital Flagship, Technical Architecture

Version 1.0.

## 1. Stack decisions (locked)
- Framework: Next.js 15, App Router, TypeScript.
- Styling: Tailwind CSS, with design tokens from the Frontend Spec.
- Content and catalogue: Sanity (headless CMS). One source for catalogue, editorial content, stores, and site settings, editable by non-technical staff.
- Images: the Sanity image pipeline (on-the-fly resize, crop, and format through its CDN). No separate image host needed.
- Hosting: Vercel. Edge CDN, autoscaling, native Next.js support.
- Rendering: Static Generation with Incremental Static Regeneration (ISR). Catalogue and content pages are pre-rendered and edge-cached, revalidated on a webhook from Sanity.

Rationale: this combination makes content editable without code, serves cached static pages that absorb festival spikes cheaply, and solves the image resolution and performance problem through Sanity transforms. It is the lowest-operations path to a scalable saree catalogue.

## 2. Why not the alternatives
- Shopify: adds a checkout and inventory system this business does not use yet, since commerce is on WhatsApp. Revisit in v2 if on-site cart is wanted.
- Airtable or a Google Sheet as the store: fine for ten rows, not for a real catalogue with images, references, and editing roles. Sanity scales further with better media handling.
- Keeping the static HTML: no content editing, no scaling story, images stuck at the exported resolution. This is the thing we are migrating away from.

## 3. Content model (Sanity schemas)
- saree: name, slug, fabric (reference), price, images[], colourFamily, borderColour, palluMotif, isNew, occasion[], silkMarkCertified, description, careNotes, storeAvailability.
- fabric: name, slug, script names (ta, te, hi), story, heroImage. Six core documents (Chiffon, Georgette, Crepe, Tussar, Kora Silk, Designer Blend) plus heritage weaves.
- moodStory: colour name, script, subtitle, hero image, filter query.
- store: city, address, coordinates (lat, lng), storeCount, hours, mapsUrl.
- bridalLook: ceremony, saree (reference), image, note.
- journalPost: title, slug, category, cover, body.
- siteSettings (singleton): whatsappNumber, announcementTicker[], socialLinks, mapsProvider.

## 4. Data flow
Build time: generateStaticParams pulls slugs from Sanity, pages pre-render through GROQ queries. Runtime: ISR revalidates a page when Sanity content changes, via an authenticated webhook to a Next.js revalidate route. The Find your drape finder fetches the catalogue and filters, either client side or through GROQ queries per selection.

## 5. Repository structure
- /app: routes (home, /sarees, /sarees/[slug], /fabric/[slug], /bridal, /stores, /journal, /find).
- /components: Header, Hero, ProductCard, WeaveGrid, MoodGrid, NewDropsRail, Finder, CraftPanel, BridalSection, StoreLocator, Footer, WhatsAppButton, TempleBorder, Kolam.
- /lib: Sanity client, GROQ queries, image url builder, WhatsApp link builder.
- /reference: the exported Mugdha.dc.html, the visual source of truth, not shipped.
- /docs: these four documents.
- /messages: i18n strings (en, ta, te, hi).

## 6. Integrations
- WhatsApp: a wa.me deep link, message template built in /lib, number from siteSettings.
- Maps: Google Maps JS embed or Mapbox GL, key in env, restricted by referrer, store coordinates from Sanity.
- Analytics: Vercel Analytics or Plausible, privacy friendly.

## 7. Environments
- Local: .env.local with Sanity project id and dataset, Maps key, base URL.
- Preview and Production: Vercel env vars, with separate Sanity datasets (development and production) so editors do not touch live data during testing.

## 8. Performance targets
LCP under 2.5s on 4G, images served responsive and lazy, one signature WebGL moment (the living silk) code-split and deferred, and a full reduced-motion static fallback.
