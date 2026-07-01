# Mugdha Digital Flagship, Product Requirements Document

Version 1.0. Owner: Utkarsh. Status: build kickoff.

## 1. Summary
Convert the finished static design (the exported Mugdha.dc.html from Claude Design) into a scalable, editable, fast production website for Mugdha, a heritage silk and saree house with 25+ stores across Hyderabad, Bengaluru, Chennai and Andhra Pradesh. Commerce runs on WhatsApp, not on-site checkout. The design is settled. This build is architecture, content, and performance, not visual exploration.

## 2. Goals
- A non-technical Mugdha editor can add or edit a saree, price, store, or collection without touching code.
- Sharp images and fast load on mid-range Android over 4G.
- Survive festival and drop traffic spikes without manual scaling.
- Every product and the finder end in a WhatsApp message the shop can act on.
- A real store map with working directions.

## 3. Non-goals (v1)
On-site cart and payments, user accounts, AR try-on, the bespoke drape commission flow, and the UGC reels wall. These are phase 2, gated on real assets or a commerce decision.

## 4. Users
- Buyer: mostly mobile, Indian festival and bridal shopper, camera and share native, decides in seconds, cares about Silk Mark, price, and store proximity.
- Mugdha editor: adds catalogue and edits content, no code.
- Atelier and bridal team: receives WhatsApp enquiries with full product context.

## 5. Scope (v1 features)
1. Home: living-silk hero, the six house weaves, read by colour, newly on the loom, the making, bridal teaser, store locator, journal teaser, join list, footer.
2. Collection pages by fabric (Chiffon, Georgette, Crepe, Tussar, Kora Silk, Designer Blend) and by occasion.
3. Product page: gallery, weave and zari specs, Silk Mark, price, WhatsApp reserve, related sarees.
4. Find your drape: filters the real catalogue by fabric, colour family, korvai border, and pallu motif, returns real matching sarees, each reserving on WhatsApp.
5. Store locator: real map, correct city pins, store counts, Directions deep links.
6. WhatsApp reserve: deep link with a pre-filled message carrying saree name, id, fabric, and image URL.
7. Editable content through a CMS for catalogue, stores, bridal looks, mood stories, journal, and site settings including the WhatsApp number.
8. Language switch for EN, Tamil, Telugu, Hindi on nav and key headers.

## 6. Success metrics
- An editor adds a saree with no developer help.
- LCP under 2.5s on 4G mid-range Android, catalogue pages served from edge cache.
- WhatsApp reserve click rate and finder completion rate are tracked.
- Zero hardcoded catalogue left in code after migration.

## 7. Phases
- v1: this build (catalogue, finder, locator, WhatsApp, CMS, images, i18n).
- v2: AR try-on, bespoke commission flow, reels wall, and optional Shopify if on-site checkout is wanted.

## 8. Inputs still needed from Mugdha
- Real high-resolution saree photography.
- Real WhatsApp business number (replaces the placeholder 919999999999).
- Google Maps or Mapbox API key and real store addresses per city.
