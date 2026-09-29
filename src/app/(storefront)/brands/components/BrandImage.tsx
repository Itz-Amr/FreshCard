"use client";
import Image from "next/image";
import { useState } from "react";

export default function BrandImage({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  let valid = false;
  try {
    const url = new URL(src);
    valid =
      url.protocol === "https:" &&
      url.hostname === "ecommerce.routemisr.com" &&
      url.pathname.startsWith("/Route-Academy-brands/");
  } catch {}
  if (!valid || failed === src)
    return (
      <span
        className="brand-image-fallback"
        role="img"
        aria-label={`${name}: logo unavailable`}
      >
        Logo unavailable
      </span>
    );
  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="(max-width: 600px) 35vw, (max-width: 767px) 25vw, (max-width: 1535px) 12vw, 160px"
      onError={() => setFailed(src)}
    />
  );
}
