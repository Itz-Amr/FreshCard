import { Skeleton } from "@/components/ui/skeleton";
import ProductsSkeleton from "../products/components/ProductsSkeleton";
import "./search.css";
export default function SearchLoading() {
  return (
    <section className="search-page" aria-label="Loading search">
      <div className="search-heading">
        <div className="app-container">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-[54px] max-w-[672px]" />
        </div>
      </div>
      <div className="app-container search-layout">
        <aside className="search-sidebar">
          <Skeleton className="h-[818px]" />
        </aside>
        <section className="search-results">
          <ProductsSkeleton />
        </section>
      </div>
    </section>
  );
}
