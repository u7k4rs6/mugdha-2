import { type SchemaTypeDefinition } from "sanity";
import { saree } from "./saree";
import { fabric } from "./fabric";
import { moodStory } from "./moodStory";
import { store } from "./store";
import { bridalLook } from "./bridalLook";
import { journalPost } from "./journalPost";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [saree, fabric, moodStory, store, bridalLook, journalPost, siteSettings],
};
