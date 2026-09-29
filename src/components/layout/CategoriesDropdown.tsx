"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { categoryHref } from "@/app/(storefront)/categories/categories.navigation";
import { Icon } from "@/components/shared/storefront-ui";

export default function CategoriesDropdown({
  categories,
}: {
  categories: { _id: string; name: string; slug: string }[];
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    // biome-ignore lint/a11y/useSemanticElements: This group contains navigation links and a disclosure trigger, not form fields.
    <div
      className="categories-menu"
      role="group"
      aria-label="Categories navigation"
      onPointerEnter={(event) => {
        if (
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        Categories <Icon name="chevronDown" />
      </button>
      <div id={menuId} hidden={!open}>
        <Link href="/categories" onClick={() => setOpen(false)}>
          All Categories
        </Link>
        {categories.map((category) => (
          <Link
            href={categoryHref(category._id)}
            key={category.slug}
            onClick={() => setOpen(false)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
