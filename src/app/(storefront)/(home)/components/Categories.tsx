import Link from "next/link";
import { categoryHref } from "@/app/(storefront)/categories/categories.navigation";
import { getCategories } from "@/app/(storefront)/categories/categories.services";
import type { Category } from "@/app/(storefront)/categories/categories.types";
import CategoriesRetry from "@/app/(storefront)/categories/components/CategoriesRetry";
import CategoryImage from "@/components/catalog/CategoryImage";
import {
  Icon,
  PageContainer,
  SectionHeading,
} from "@/components/shared/storefront-ui";

export default async function Categories() {
  let categories: Category[] | undefined;
  try {
    categories = await getCategories();
  } catch {}
  return (
    <section className="category-section" id="categories">
      <PageContainer>
        <div className="category-heading">
          <SectionHeading accent="Category">Shop By</SectionHeading>
          <Link href="/categories">
            View All Categories <Icon name="categoryArrow" />
          </Link>
        </div>
        {!categories ? (
          <div className="home-categories-message" role="alert">
            <p>Categories are temporarily unavailable.</p>
            <CategoriesRetry />
          </div>
        ) : categories.length === 0 ? (
          <p className="home-categories-message">
            No categories available yet.
          </p>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                className="category-card"
                href={categoryHref(category._id)}
                key={category._id}
                data-category-id={category._id}
              >
                <CategoryImage src={category.image} name={category.name} />
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}
