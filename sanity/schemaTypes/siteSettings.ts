import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

// Mirrors the SiteSettings interface in /lib/types.ts exactly. A singleton,
// enforced through Studio Structure (sanity/structure.ts) with a fixed
// document id of "siteSettings", not through a schema option.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description:
        "Digits only, country code first, no plus sign or spaces. The one editable place this number lives, every WhatsApp link on the site reads it from here.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[0-9]+$/, { name: "digits only" })
          .error("Digits only, country code first, no plus sign or spaces"),
    }),
    defineField({
      name: "announcementTicker",
      title: "Announcement ticker",
      description: "The scrolling strip of phrases at the very top of the site.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "whatsapp", title: "WhatsApp URL", type: "url" }),
      ],
    }),
    defineField({
      name: "mapsProvider",
      title: "Maps provider",
      type: "string",
      options: {
        list: [
          { title: "Google Maps", value: "google" },
          { title: "Mapbox", value: "mapbox" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
