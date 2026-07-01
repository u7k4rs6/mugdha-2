import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons";

// Mirrors the MoodStory interface in /lib/types.ts exactly.
export const moodStory = defineType({
  name: "moodStory",
  title: "Mood story",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "colorName",
      title: "Colour name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "script",
      title: "Script accent",
      description: "A single decorative glyph, ornamental only.",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      description: 'e.g. "29 sarees".',
      type: "string",
      validation: (rule) => rule.required(),
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
      name: "filterQuery",
      title: "Filter query",
      type: "object",
      fields: [
        defineField({
          name: "colorFamily",
          title: "Colour family",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "colorName", subtitle: "subtitle", media: "heroImage" },
  },
});
