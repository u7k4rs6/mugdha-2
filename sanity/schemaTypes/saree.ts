import { defineField, defineType } from "sanity";
import { DiamondIcon } from "@sanity/icons";

// Mirrors the Saree interface in /lib/types.ts exactly. Note this is a
// deliberate simplification from the original architecture doc's
// "images[]" gallery: Step 2 shipped every component around a single
// `image: string`, so the schema keeps one hero image per saree rather
// than a gallery, to avoid changing the type contract or any component.
export const saree = defineType({
  name: "saree",
  title: "Saree",
  type: "document",
  icon: DiamondIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 200 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fabric",
      title: "Fabric",
      type: "reference",
      to: [{ type: "fabric" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      description: "In rupees.",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "mrp",
      title: "MRP",
      description: "In rupees.",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "offerPercent",
      title: "Offer percent",
      type: "number",
      validation: (rule) => rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "colorFamily",
      title: "Colour family",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "borderColour",
      title: "Border colour",
      type: "string",
    }),
    defineField({
      name: "palluMotif",
      title: "Pallu motif",
      type: "string",
      options: {
        list: [
          { title: "Peacock", value: "peacock" },
          { title: "Mango buta", value: "buta" },
          { title: "Temple", value: "temple" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      // Soft requirement: a handful of source photos 403 from the original
      // host and need to be resupplied by Mugdha. See the migration report.
      // Leaving this a warning, not an error, keeps those documents visible
      // and editable in Studio instead of blocking on the missing asset.
      validation: (rule) => rule.warning("Every saree should have a photo before it goes live."),
    }),
    defineField({
      name: "isNew",
      title: "New drop",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "silkMarkCertified",
      title: "Silk Mark certified",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "careNotes",
      title: "Care notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "storeAvailability",
      title: "Store availability",
      type: "array",
      of: [{ type: "reference", to: [{ type: "store" }] }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "colorFamily", media: "image" },
  },
});
