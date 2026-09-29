import { PageContainer } from "@/components/shared/storefront-ui";
import BrandsHero from "./components/BrandsHero";
import "./brands.css";

export default function BrandsLoading() {
  return (
    <section
      className="brands-page"
      aria-busy="true"
      aria-label="Loading brands"
    >
      <BrandsHero />
      <PageContainer className="brands-content">
        <div className="brands-grid">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              className="brand-loading skeleton"
              // biome-ignore lint/suspicious/noArrayIndexKey: Fixed decorative skeletons have no state or reordering.
              key={`brand-loading-${index}`}
            />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
