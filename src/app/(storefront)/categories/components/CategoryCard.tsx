import Image from "next/image";
import Link from "next/link";
import CategoryImage from "@/components/catalog/CategoryImage";
import { categoryHref } from "../categories.navigation";
import type { Category } from "../categories.types";
export default function CategoryCard({
  category,
  selected,
}: {
  category: Category;
  selected: boolean;
}) {
  return (
    <div className="taxonomy-entry">
      <Link
        className="taxonomy-card"
        href={categoryHref(category._id)}
        data-category-id={category._id}
        aria-current={selected ? "true" : undefined}
      >
        <div className="taxonomy-image">
          <CategoryImage
            src={category.image}
            name={category.name}
            fill
            sizes="(max-width: 600px) 40vw, (max-width: 767px) 25vw, (max-width: 1535px) 15vw, 232px"
          />
        </div>
        <h2>{category.name}</h2>
        <span className="taxonomy-card-action">
          View Products
          <Image
            src="/assets/categories/arrow.svg"
            alt=""
            width={13}
            height={10}
            unoptimized
          />
        </span>
      </Link>
      <Link
        className="taxonomy-subcategories-link"
        href={`/categories?category=${category._id}#subcategories`}
        aria-label={`View ${category.name} subcategories`}
        aria-current={selected ? "page" : undefined}
      >
        View subcategories
      </Link>
    </div>
  );
}
