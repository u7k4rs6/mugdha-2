import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Marcellus,
  Hanken_Grotesk,
  Noto_Serif_Tamil,
  Noto_Serif_Telugu,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";

// Couture serif: display and headings.
const cormorantGaramond = Cormorant_Garamond({
  variable: "--nf-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Eyebrows and structural labels: small letterspaced gold caps.
const marcellus = Marcellus({
  variable: "--nf-label",
  subsets: ["latin"],
  weight: "400",
});

// Body, UI, prices, captions: the quiet grotesk.
const hankenGrotesk = Hanken_Grotesk({
  variable: "--nf-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Script accents, decorative only, one language each.
const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--nf-tamil",
  subsets: ["tamil", "latin"],
  weight: ["400", "500"],
});

const notoSerifTelugu = Noto_Serif_Telugu({
  variable: "--nf-telugu",
  subsets: ["telugu", "latin"],
  weight: ["400", "500"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--nf-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Mugdha, Heritage Silk Sarees",
  description:
    "Mugdha is a heritage silk and saree house with 25+ stores across Hyderabad, Bengaluru, Chennai and Andhra Pradesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${marcellus.variable} ${hankenGrotesk.variable} ${notoSerifTamil.variable} ${notoSerifTelugu.variable} ${notoSerifDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-kora-ivory font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
