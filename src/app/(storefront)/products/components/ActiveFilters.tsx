import Link from "next/link";

export default function ActiveFilters({
  filters,
  clearHref,
}: {
  filters: { id: string; label: string; removeHref: string }[];
  clearHref: string;
}) {
  return (
    <nav className="active-product-filters" aria-label="Active product filters">
      <span className="active-filter-label">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1 2h14L9.5 8v6l-3-2V8L1 2Z" />
        </svg>
        Active Filters:
      </span>
      {filters.map((filter) => (
        <span className="active-filter-chip" key={filter.id}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M1 2h6l7 7-5 5-8-8V2Zm3 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          {filter.label}
          <Link
            href={filter.removeHref}
            aria-label={`Remove ${filter.label} filter`}
            className="active-filter-remove"
          >
            ×
          </Link>
        </span>
      ))}
      <Link className="active-filter-clear" href={clearHref}>
        Clear all
      </Link>
    </nav>
  );
}
