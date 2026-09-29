import MotionReveal from "@/components/shared/MotionReveal";
import { Icon, PageContainer } from "@/components/shared/storefront-ui";

const benefits = [
  {
    title: "Saved Addresses",
    description: "Choose your delivery address",
    icon: "shippingBenefit",
    compactIcon: "shippingGreen",
  },
  {
    title: "Payment Options",
    description: "Cash or card checkout",
    icon: "paymentBenefit",
    compactIcon: "paymentGreen",
  },
  {
    title: "Order History",
    description: "View your orders",
    icon: "returnsBenefit",
    compactIcon: "returnsGreen",
  },
  {
    title: "Your Wishlist",
    description: "Save your favorite products",
    icon: "supportBenefit",
    compactIcon: "supportGreen",
  },
] as const;
export default function BenefitsBar({
  compact = false,
  animated = false,
}: {
  compact?: boolean;
  animated?: boolean;
}) {
  const items = compact
    ? [benefits[0], benefits[2], benefits[1], benefits[3]]
    : benefits;
  return (
    <section
      aria-label="Shopping benefits"
      className={`benefits ${compact ? "benefits-compact" : ""}`}
    >
      <PageContainer>
        <div className="benefits-grid">
          {items.map((item, index) => (
            <MotionReveal
              className="benefit"
              key={item.title}
              enabled={animated}
              delay={index * 0.1}
            >
              <span className="benefit-icon">
                <Icon name={compact ? item.compactIcon : item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
