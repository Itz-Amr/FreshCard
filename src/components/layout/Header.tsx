import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { logoutAction } from "@/app/(auth)/login/login.actions";
import { getNavigationCategories } from "@/app/(storefront)/categories/categories.services";
import { auth } from "@/auth";
import { Icon, PageContainer } from "@/components/shared/storefront-ui";
import { assets } from "@/data/catalog";
import AccountMenu from "./AccountMenu";
import CartLink from "./CartLink";
import CategoriesDropdown from "./CategoriesDropdown";
import HeaderSearch from "./HeaderSearch";
import WishlistLink from "./WishlistLink";

export default async function Header() {
  const session = await auth();
  return (
    <header>
      <div className="topbar">
        <PageContainer className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span>
              <Icon name="shippingSmall" />
              Explore our products
            </span>
            <span>
              <Icon name="arrivalsSmall" />
              Shop by category
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href={session?.user ? "/profile/addresses" : "/login"}>
              <Icon name="userSmall" />
              {session?.user?.name ?? "Sign In"}
            </Link>
            {session?.user ? (
              <form action={logoutAction}>
                <button type="submit">
                  <Icon name="signOut" />
                  Sign Out
                </button>
              </form>
            ) : (
              <Link href="/register">Sign Up</Link>
            )}
          </div>
        </PageContainer>
      </div>
      <PageContainer className="main-nav">
        <Link href="/" aria-label="FreshCart home" className="brand">
          <Image
            src={assets.logo}
            alt="FreshCart"
            width={165}
            height={32}
            preload
            unoptimized
          />
        </Link>
        <HeaderSearch />
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/products">Shop</Link>
          <Suspense fallback={<CategoriesDropdown categories={[]} />}>
            <HeaderCategories />
          </Suspense>
          <Link href="/brands">Brands</Link>
        </nav>
        <div className="nav-actions">
          <WishlistLink />
          <CartLink />
          {session?.user ? (
            <AccountMenu name={session.user.name} />
          ) : (
            <Link href="/login" className="button nav-sign-in">
              Sign In
            </Link>
          )}
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            <HeaderSearch mobile />
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Shopping Cart</Link>
            <Link href={session?.user ? "/profile/addresses" : "/login"}>
              {session?.user ? "My account" : "Sign In"}
            </Link>
            {session?.user ? (
              <form action={logoutAction}>
                <button type="submit">Sign Out</button>
              </form>
            ) : (
              <Link href="/register">Create Account</Link>
            )}
          </nav>
        </details>
      </PageContainer>
    </header>
  );
}

async function HeaderCategories() {
  return <CategoriesDropdown categories={await getNavigationCategories()} />;
}
