import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

// Mirrors the Store interface in /lib/types.ts exactly. Coordinates use
// Sanity's geopoint type (gives editors a map picker in Studio) and are
// queried back out as the plain { lat, lng } shape the type expects.
export const store = defineType({
  name: "store",
  title: "Store",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "storeCount",
      title: "Store count",
      description: "Number of Mugdha stores in this city.",
      type: "number",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "string",
    }),
    defineField({
      name: "mapsUrl",
      title: "Maps URL",
      description: "Optional override. If unset, the frontend builds a Google Maps directions link from the address.",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "city", subtitle: "address" },
  },
});
