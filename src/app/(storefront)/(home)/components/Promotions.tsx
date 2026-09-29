import Link from "next/link";
import MotionReveal from "@/components/shared/MotionReveal";
import { Icon, PageContainer } from "@/components/shared/storefront-ui";
import { Button } from "@/components/ui/button";

export default function Promotions() {
  return (
    <section id="deals" className="promotions">
      <PageContainer>
        <div className="promo-grid">
          {[
            {
              tag: "Explore the catalog",
              title: "Find Your Favorites",
              description: "Browse products across our categories",
              action: "Shop Now",
            },
            {
              tag: "Browse brands",
              title: "Explore Our Brands",
              description: "Find products from the brands you love",
              action: "Explore Now",
            },
          ].map((promo, i) => (
            <MotionReveal
              x={i ? 50 : -50}
              y={0}
              duration={0.8}
              className={`promo-card ${i ? "promo-orange" : ""}`}
              key={promo.title}
            >
              <span className="promo-tag">{promo.tag}</span>
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>
              <Button asChild variant="white">
                <Link href={i ? "/brands" : "/products"}>
                  {promo.action}
                  <Icon name={i ? "orangeArrow" : "greenArrow"} />
                </Link>
              </Button>
            </MotionReveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
