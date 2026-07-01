import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons";

// Mirrors the BridalLook interface in /lib/types.ts exactly. `sareeId` in
// the type is the referenced Saree's id; here that is a real reference
// field named `saree`, queried back out as `sareeId` so the shape matches.
export const bridalLook = defineType({
  name: "bridalLook",
  title: "Bridal look",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "ceremony",
      title: "Ceremony",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "saree",
      title: "Saree",
      type: "reference",
      to: [{ type: "saree" }],
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
          validation: (rule) => rule.required().warning("Alt text is important for accessibility and SEO"),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "ceremony", subtitle: "note", media: "image" },
  },
});
