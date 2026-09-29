import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getCategory } from "./categories.services";
import type { Category } from "./categories.types";
import CategoriesHero from "./components/CategoriesHero";
import CategoriesRetry from "./components/CategoriesRetry";
import CategoryCard from "./components/CategoryCard";
import Subcategories from "./components/Subcategories";
import "./categories.css";
export const metadata: Metadata = { title: "All Categories | FreshCart" };
export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const query = (await searchParams).category;
  let categories: Category[] | undefined;
  try {
    categories = await getCategories();
  } catch {}
  const selected =
    categories && typeof query === "string"
      ? await getCategory(query)
      : undefined;
  return (
    <section className="categories-page">
      <CategoriesHero />
      <div className="app-container categories-content">
        {!categories ? (
          <div className="categories-message" role="alert">
            <h2>We couldn't load categories</h2>
            <p>Please try again in a moment.</p>
            <CategoriesRetry />
          </div>
        ) : categories.length === 0 ? (
          <div className="categories-message">
            <h2>No categories available</h2>
            <p>Please check back soon.</p>
            <Link className="button" href="/">
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="taxonomy-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  selected={category._id === selected?._id}
                />
              ))}
            </div>
            {selected ? (
              <Suspense
                key={selected._id}
                fallback={
                  <div
                    className="subcategories-panel"
                    id="subcategories"
                    aria-busy="true"
                  >
                    Loading subcategories…
                  </div>
                }
              >
                <Subcategories category={selected} />
              </Suspense>
            ) : query ? (
              <div className="categories-message" id="subcategories">
                <h2>Category not found</h2>
                <Link href="/categories">Browse all categories</Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
