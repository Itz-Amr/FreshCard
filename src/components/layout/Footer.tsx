import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/shared/storefront-ui";
import { assets } from "@/data/catalog";
import BenefitsBar from "./BenefitsBar";

const columns = [
  {
    title: "Shop",
    items: [
      ["All Products", "/products"],
      ["Categories", "/categories"],
      ["Brands", "/brands"],
      ["Search", "/search"],
    ],
  },
  {
    title: "Account",
    items: [
      ["My Account", "/profile/addresses"],
      ["Order History", "/orders"],
      ["Wishlist", "/wishlist"],
      ["Shopping Cart", "/cart"],
      ["Sign In", "/login"],
      ["Create Account", "/register"],
    ],
  },
];
export default function Footer() {
  return (
    <>
      <BenefitsBar compact />
      <footer id="footer">
        <PageContainer className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="footer-logo">
              <Image
                src={assets.logo}
                alt="FreshCart"
                width={165}
                height={32}
                unoptimized
              />
            </Link>
            <p>
              Explore fashion, electronics and everyday essentials. Save your
              favorites and manage your shopping in one place.
            </p>
          </div>
          {columns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.items.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </PageContainer>
        <div className="footer-bottom">
          <PageContainer>
            <p>© 2026 FreshCart. All rights reserved.</p>
          </PageContainer>
        </div>
      </footer>
    </>
  );
}
