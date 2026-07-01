import { buildWhatsAppTextLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

/**
 * A wa.me link, styled either as the header's rounded green pill or as an
 * icon-over-label for the mobile sticky bottom bar. Both usages in the
 * reference point at the same "I want to explore your sarees" enquiry text.
 */
export function WhatsAppButton({
  settings,
  message,
  variant = "pill",
  label = "WhatsApp",
}: {
  settings: SiteSettings;
  message: string;
  variant?: "pill" | "icon";
  label?: string;
}) {
  const href = buildWhatsAppTextLink(message, settings);

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          color: "#57B947",
          fontWeight: 600,
          fontSize: "10.5px",
        }}
      >
        <span style={{ fontSize: "17px", lineHeight: 1 }}>✆</span>
        {label}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        textDecoration: "none",
        background: "#57B947",
        color: "#fff",
        fontWeight: 600,
        fontSize: "13.5px",
        padding: "10px 15px",
        borderRadius: "30px",
      }}
    >
      {label}
    </a>
  );
}
