import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/shared/storefront-ui";
import { getBrands } from "./brands.services";
import type { Brand } from "./brands.types";
import BrandCard from "./components/BrandCard";
import BrandsHero from "./components/BrandsHero";
import BrandsRetry from "./components/BrandsRetry";
import "./brands.css";

export const metadata: Metadata = { title: "Top Brands | FreshCart" };
export default async function BrandsPage() {
  let brands: Brand[] | undefined;
  try {
    brands = await getBrands();
  } catch {}
  return (
    <section className="brands-page">
      <BrandsHero />
      <PageContainer className="brands-content">
        {!brands ? (
          <div className="brands-message" role="alert">
            <h2>We couldn't load brands</h2>
            <p>Please try again in a moment.</p>
            <BrandsRetry />
          </div>
        ) : !brands.length ? (
          <div className="brands-message">
            <h2>No brands available</h2>
            <p>Please check back soon.</p>
            <Link className="button" href="/">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map((brand) => (
              <BrandCard key={brand._id} brand={brand} />
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}
