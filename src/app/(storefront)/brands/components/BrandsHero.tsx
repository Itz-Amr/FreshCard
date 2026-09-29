import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/shared/storefront-ui";

export default function BrandsHero() {
  return (
    <div className="brands-hero">
      <PageContainer>
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Brands</span>
        </nav>
        <div className="brands-hero-title">
          <span className="brands-hero-icon">
            <Image
              src="/assets/brands/tags.svg"
              alt=""
              width={37.5}
              height={30}
              unoptimized
            />
          </span>
          <div>
            <h1>Top Brands</h1>
            <p>Shop from your favorite brands</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
