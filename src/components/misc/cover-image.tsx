/* eslint-disable @next/next/no-img-element -- remote publisher/cover URLs from many hosts; next/image would need every domain allow-listed */
"use client";

export const PLACEHOLDER_IMAGE = "/ReadHub_PlaceHolder.png";

type CoverImageProps = Omit<React.ComponentProps<"img">, "src" | "alt" | "onError"> & { src?: string | null; alt?: string };

/**
 * Remote image that falls back to the ReadHub placeholder when the URL is
 * missing or broken. Swaps only once, so a failing placeholder can't loop.
 * Lazy-loaded and sent without a referrer (some publishers block hotlinks).
 */
export function CoverImage({ src, alt = "", loading = "lazy", ...props }: CoverImageProps) {
  return (
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.fallback) return;
        image.dataset.fallback = "1";
        image.src = PLACEHOLDER_IMAGE;
      }}
      {...props}
    />
  );
}
