import CategoriesHero from "./components/CategoriesHero";
import "./categories.css";
export default function CategoriesLoading() {
  return (
    <section
      className="categories-page"
      aria-busy="true"
      aria-label="Loading categories"
    >
      <CategoriesHero />
      <div className="app-container categories-content">
        <div className="taxonomy-grid">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              className="taxonomy-loading skeleton"
              // biome-ignore lint/suspicious/noArrayIndexKey: Fixed decorative skeletons have no state or reordering.
              key={`category-loading-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
