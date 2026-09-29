"use client";

import { type ReactNode, useId, useState } from "react";
import ProductIcon from "@/components/catalog/ProductIcon";

export default function ProductTabs({
  details,
  reviews,
  shipping,
  reviewCount,
}: {
  details: ReactNode;
  reviews: ReactNode;
  shipping: ReactNode;
  reviewCount: number;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = [
    { label: "Product Details", icon: "details", content: details },
    { label: `Reviews (${reviewCount})`, icon: "reviews", content: reviews },
    { label: "Shipping & Returns", icon: "shipping", content: shipping },
  ] as const;
  return (
    <section className="product-tabs">
      <div
        role="tablist"
        aria-label="Product information"
        className="product-tab-list"
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === active}
            tabIndex={index === active ? 0 : -1}
            key={tab.label}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            <ProductIcon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== active}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: The ARIA tabs pattern makes a text-only panel focusable.
          tabIndex={0}
          className="product-tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </section>
  );
}
