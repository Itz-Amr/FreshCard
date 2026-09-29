import { Skeleton } from "@/components/ui/skeleton";
export default function ProductsSkeleton() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: This loading region contains block card layouts, not form output.
    <div className="product-grid" aria-label="Loading products" role="status">
      {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id) => (
        <div className="product-card" key={id}>
          <Skeleton className="product-image" />
          <div className="product-details">
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-price" />
          </div>
        </div>
      ))}
    </div>
  );
}
