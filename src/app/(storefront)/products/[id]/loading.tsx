import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: This loading region contains the entire product layout, not form output.
    <div
      className="product-page app-container"
      role="status"
      aria-label="Loading product"
    >
      <Skeleton className="breadcrumb-skeleton" />
      <div className="product-overview">
        <div className="product-gallery">
          <Skeleton className="gallery-image" />
          <div className="thumbnail-skeletons">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
        <div className="product-info product-info-skeleton">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-price" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-content" />
          <Skeleton className="skeleton-content" />
        </div>
      </div>
      <Skeleton className="skeleton-tabs" />
    </div>
  );
}
