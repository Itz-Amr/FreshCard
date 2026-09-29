"use client";
import Image from "next/image";
import { useState } from "react";
import { productImageUrl } from "@/lib/product-display";
export default function ProductImage({
  src,
  alt,
  sizes,
  preload = false,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  preload?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const source = productImageUrl(src);
  return source && failed !== source ? (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      onError={() => setFailed(source)}
    />
  ) : (
    <span
      className="product-image-fallback"
      role="img"
      aria-label={`${alt}: image unavailable`}
    >
      Image unavailable
    </span>
  );
}
