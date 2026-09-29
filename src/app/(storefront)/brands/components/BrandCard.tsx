import Image from "next/image";
import Link from "next/link";
import { productsHref } from "../../products/product.navigation";
import type { Brand } from "../brands.types";
import BrandImage from "./BrandImage";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      className="brand-card"
      href={productsHref({ brand: brand._id })}
      data-brand-id={brand._id}
      aria-label={`View ${brand.name} products`}
    >
      <div className="brand-image">
        <div>
          <BrandImage src={brand.image} name={brand.name} />
        </div>
      </div>
      <h2>{brand.name}</h2>
      <span className="brand-card-action" aria-hidden="true">
        View Products
        <Image
          src="/assets/brands/arrow.svg"
          alt=""
          width={12.5}
          height={10}
          unoptimized
        />
      </span>
    </Link>
  );
}
