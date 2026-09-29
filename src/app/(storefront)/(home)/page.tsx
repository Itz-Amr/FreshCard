import { Suspense } from "react";
import BenefitsBar from "@/components/layout/BenefitsBar";
import {
  PageContainer,
  SectionHeading,
} from "@/components/shared/storefront-ui";
import ProductsGrid from "../products/components/ProductsGrid";
import ProductsSkeleton from "../products/components/ProductsSkeleton";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Promotions from "./components/Promotions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  return (
    <div className="home-page">
      <Hero />
      <BenefitsBar animated />
      <Categories />
      <Promotions />
      <section id="products" className="products-section">
        <PageContainer>
          <SectionHeading accent="Products">Featured</SectionHeading>
          <Suspense key={page} fallback={<ProductsSkeleton />}>
            <ProductsGrid page={page} home />
          </Suspense>
        </PageContainer>
      </section>
    </div>
  );
}
