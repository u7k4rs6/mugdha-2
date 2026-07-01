# Mugdha Digital Flagship, Frontend Spec

Version 1.0. The exported Mugdha.dc.html is the visual source of truth. This spec turns it into reusable, data-bound components. Reproduce the design exactly, then bind it to Sanity.

## 1. Design tokens (locked from the design)
Colour:
- Kora ivory #F4EFE3 (daylight ground)
- Kora soft #EFE7D6 (alternate sections)
- Arakku oxblood #5A1A1F (primary action on light)
- Temple stone #1A0E12 to #20131A (sacred-dark grounds)
- Zari gold #C9A227, highlight #E9C766 (hairlines, temple border, lamp light)
- Mayil peacock #0E5C58, Marigold #E08A1E (festive accents from the silk, used sparingly)
- Text: warm near-black #241A14 on light, ivory on dark.

The one rule that made the site premium: colour comes only from real silk photography and lamp gold. Never a flat colour fill placed over a saree photo. Never a full-spectrum gradient.

Type:
- Display and headings: couture serif (Cormorant Garamond or Fraunces), lighter weights, generous line-height. The heavy ultra-bold sans is retired.
- Eyebrows and structural labels: Marcellus, small letterspaced gold caps, no leading dash.
- Body, UI, prices, captions: a quiet grotesk (Hanken Grotesk or General Sans).
- Script accents: Noto Serif Tamil, Telugu, Devanagari, decorative only.

## 2. Section rhythm
Alternate sacred-dark moments (hero, the making, bridal, the finder) with daylight-courtyard moments (the shop grids on ivory). Sacred-dark carries the drama and interactivity. Daylight keeps browsing calm and the silk true.

## 3. Component inventory and data binding
- Header: wordmark, nav, language switch (EN, Ta, Te, Hi), announcement ticker (from siteSettings), WhatsApp button (number from siteSettings).
- Hero: a living-silk WebGL surface mapping a real saree image, cursor-as-lamp gold light, gyroscope on mobile, headline crossing a calm area of the silk with a legibility scrim, one action. Static fallback for reduced motion.
- WeaveGrid (The six house weaves): fabric documents, real image, name, script, gold rule, no badges.
- MoodGrid (Read by colour): six moodStory documents, each a real different saree photo, name, subtitle, thin rule. No colour overlays.
- NewDropsRail (Newly on the loom): sarees where isNew, real photo, name, fabric, quiet price, no badges, no per-card button.
- Finder (Find your drape): filter controls bound to fabric, colourFamily, borderColour, palluMotif, returning real matching saree documents, each with a WhatsApp reserve carrying the real product config. The preview shows the real matched saree, never a flat tint.
- CraftPanel (The making): fabric story, script, on-the-loom time, one real saree image, thin gold frame, no bright bars.
- BridalSection: three different real bridal sarees (bridalLook documents), large and reverent, no colour overlays, serif headline, gold eyebrow.
- StoreLocator: a real map (Maps key from env), store documents with correct coordinates, city pins with counts, Directions deep links, gold-toned card rules.
- Footer, WhatsAppButton (sticky), TempleBorder and Kolam: fine gold line motifs, drawn, reduced-motion aware.

## 4. Interactivity
Cursor-lamp light in dark sections, kolam self-draw at section thresholds, pallu unfurl on hero load, marigold petals only on save and reserve, and an optional temple sound toggle off by default. All motion reverent and slow, one signature carries the page, everything else is a quiet fade.

## 5. Accessibility and responsive
Mobile-first, grids reflow 3 to 2 to 1, a sticky bottom bar on mobile (Home, Search, Find, Wishlist, WhatsApp). A full prefers-reduced-motion static version. AA contrast on every surface. Keyboard navigation and visible focus in gold. A legibility scrim wherever type crosses silk. Captions on any video.
