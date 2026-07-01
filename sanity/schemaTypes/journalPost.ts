import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

// Mirrors the JournalPost interface in /lib/types.ts exactly. No journal
// posts exist yet and nothing renders this type this step (see
// /docs 5. Scope, journal is on the route list but not built). `body` stays
// a plain text field to match the current string-typed contract; it should
// become Portable Text once the Journal page is actually built.
export const journalPost = defineType({
  name: "journalPost",
  title: "Journal post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 200 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "cover",
      title: "Cover image",
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
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 10,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "cover" },
  },
});
