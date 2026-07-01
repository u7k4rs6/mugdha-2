import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

// Mirrors the Fabric interface in /lib/types.ts exactly.
export const fabric = defineType({
  name: "fabric",
  title: "Fabric",
  type: "document",
  icon: TagIcon,
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
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "script",
      title: "Script accent",
      description:
        "A single decorative glyph (Tamil, Telugu or Devanagari), ornamental only, not translated.",
      type: "string",
    }),
    defineField({
      name: "story",
      title: "Story",
      description: "Shown in CraftPanel for the three heritage weaves. Optional for the catalogue fabrics.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required().warning("Alt text is important for accessibility and SEO"),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "onLoomDays",
      title: "On the loom (days)",
      description: 'Only set on the three heritage weaves, e.g. "18 to 30 days".',
      type: "string",
    }),
    defineField({
      name: "accentColor",
      title: "Accent colour",
      description: "Only set on the three heritage weaves: the script glyph's colour, as a hex value.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", media: "heroImage" },
  },
});
