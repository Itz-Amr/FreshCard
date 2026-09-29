import Link from "next/link";
import { productsHref } from "../../products/product.navigation";
import { getSubcategoriesByCategory } from "../categories.services";
import type { Category, Subcategory } from "../categories.types";
import CategoriesRetry from "./CategoriesRetry";
export default async function Subcategories({
  category,
}: {
  category: Category;
}) {
  let subcategories: Subcategory[] | undefined;
  try {
    subcategories = await getSubcategoriesByCategory(category._id);
  } catch {}
  return (
    <section
      className="subcategories-panel"
      id="subcategories"
      aria-labelledby="subcategories-heading"
    >
      <div className="subcategories-heading">
        <h2 id="subcategories-heading">{category.name} subcategories</h2>
        <Link href="/categories">All Categories</Link>
      </div>
      {!subcategories ? (
        <div role="alert">
          <p>We couldn't load these subcategories. Please try again.</p>
          <CategoriesRetry />
        </div>
      ) : subcategories.length ? (
        <ul>
          {subcategories.map((item) => (
            <li key={item._id} data-subcategory-id={item._id}>
              <Link
                href={productsHref({
                  category: category._id,
                  subcategory: item._id,
                })}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subcategories are available for this category yet.</p>
      )}
    </section>
  );
}
