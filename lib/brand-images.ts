// Fixed brand imagery, not part of the Sanity content model (see the note
// in lib/data.ts). Deliberately its own module with zero Sanity import:
// components/Hero.tsx is a client component that needs HERO_IMAGE, and it
// must never pull in lib/sanity/client.ts (which now reads a server-only
// read token) into the browser bundle just by importing a string constant.

export const HERO_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771829391494__1771829391308__Designer%2520Blend.jpg";
export const BRIDAL_IMAGE =
  "https://mugdhabk.s3.ap-south-1.amazonaws.com/compress/1771307031443__1768832146285__Kora%2520Silk.jpg";
