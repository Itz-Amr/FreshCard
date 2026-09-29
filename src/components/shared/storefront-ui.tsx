import Image from "next/image";
import type { ReactNode } from "react";
import { assets } from "@/data/catalog";

export function Icon({
  name,
  className = "",
}: {
  name: keyof typeof assets;
  className?: string;
}) {
  return (
    <Image
      src={assets[name]}
      alt=""
      width={20}
      height={16}
      className={`icon ${className}`}
      unoptimized
    />
  );
}
export function PageContainer({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`app-container ${className}`}>
      {children}
    </div>
  );
}
export function SectionHeading({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) {
  return (
    <h2 className="section-heading">
      {children} <span>{accent}</span>
    </h2>
  );
}
