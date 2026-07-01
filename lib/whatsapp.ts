import { formatINR } from "./format";
import type { Saree, SiteSettings } from "./types";

/** A wa.me link carrying arbitrary text, used for enquiries not tied to one saree. */
export function buildWhatsAppTextLink(text: string, settings: SiteSettings): string {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** A wa.me link pre-filled with a saree's name, id, fabric, price and image, matching the reference reserve message. */
export function buildSareeWhatsAppLink(saree: Saree, settings: SiteSettings): string {
  const lines = [
    "Namaste Mugdha! \u{1F64F}",
    "I would like to reserve this saree.",
    "",
    `Name: ${saree.name}`,
    `Saree ID: ${saree.id}`,
    `Fabric: ${saree.fabric}`,
    `Price: ${formatINR(saree.price)}`,
    `Reference image: ${saree.image}`,
    "",
    "Please share price, customisation and delivery options.",
  ];
  return buildWhatsAppTextLink(lines.join("\n"), settings);
}
