import Image, { type ImageProps } from "next/image";

/**
 * Centralises how a content image URL becomes something <Image> can load.
 * Today this is the identity function against the S3 bucket the reference
 * design already photographs against. Step 3 swaps this for the Sanity
 * image URL builder (crop, resize, format), every call site stays the same.
 */
export function resolveImageUrl(src: string): string {
  return src;
}

export function ContentImage({ src, alt, ...rest }: ImageProps) {
  return <Image src={resolveImageUrl(src as string)} alt={alt} {...rest} />;
}
