"use client";
import Image from "next/image";
import { useState } from "react";

export default function CategoryImage({
  src,
  name,
  sizes = "80px",
  fill = false,
}: {
  src: string;
  name: string;
  sizes?: string;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  let valid = false;
  try {
    const url = new URL(src);
    valid =
      url.protocol === "https:" &&
      url.hostname === "ecommerce.routemisr.com" &&
      url.pathname.startsWith("/Route-Academy-categories/");
  } catch {}
  if (!valid || failed === src)
    return (
      <span
        className="category-image-fallback"
        role="img"
        aria-label={`${name}: image unavailable`}
      >
        Image unavailable
      </span>
    );
  return (
    <Image
      src={src}
      alt={name}
      {...(fill ? { fill: true } : { width: 80, height: 80 })}
      sizes={sizes}
      onError={() => setFailed(src)}
    />
  );
}
