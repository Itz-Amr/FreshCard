import Link from "next/link";
import { logoutAction } from "@/app/(auth)/login/login.actions";

function AccountIcon({
  name,
}: {
  name:
    | "account"
    | "profile"
    | "orders"
    | "wishlist"
    | "addresses"
    | "settings"
    | "logout";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "account" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="9" r="3" />
          <path d="M6.5 19v-2a5.5 4 0 0 1 11 0v2" />
        </>
      )}
      {name === "profile" && (
        <>
          <circle cx="12" cy="7" r="3.5" />
          <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
        </>
      )}
      {name === "orders" && (
        <>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" />
        </>
      )}
      {name === "wishlist" && (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      )}
      {name === "addresses" && (
        <>
          <rect x="4" y="3" width="14" height="18" rx="1" />
          <circle cx="11" cy="9" r="2" />
          <path d="M8 16h6M21 7v2m0 6v2" />
        </>
      )}
      {name === "settings" && (
        <>
          <path d="m9 3-.7 3-2 .9-2.7-.9-2 3.5 2.2 2.1v2.3l-2.2 2.1 2 3.5 2.7-.9 2 .9.7 3h4l.7-3 2-.9 2.7.9 2-3.5-2.2-2.1v-2.3l2.2-2.1-2-3.5-2.7.9-2-.9L13 3Z" />
          <circle cx="11" cy="12.75" r="3" />
        </>
      )}
      {name === "logout" && <path d="M9 4H4v16h5M10 12h11m-4-4 4 4-4 4" />}
    </svg>
  );
}

export default function AccountMenu({ name }: { name?: string | null }) {
  return (
    <details className="account-menu">
      <summary className="icon-button" aria-label="Account options">
        <AccountIcon name="account" />
      </summary>
      <div>
        <div className="account-menu-user">
          <span className="account-menu-avatar">
            <AccountIcon name="account" />
          </span>
          <strong>{name || "Account"}</strong>
        </div>
        <nav className="account-menu-links" aria-label="Account navigation">
          <Link href="/profile/addresses">
            <AccountIcon name="profile" />
            My Profile
          </Link>
          <Link href="/orders">
            <AccountIcon name="orders" />
            My Orders
          </Link>
          <Link href="/wishlist">
            <AccountIcon name="wishlist" />
            My Wishlist
          </Link>
          <Link href="/profile/addresses">
            <AccountIcon name="addresses" />
            Addresses
          </Link>
          <Link href="/profile/settings">
            <AccountIcon name="settings" />
            Settings
          </Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="account-menu-logout">
            <AccountIcon name="logout" />
            Sign Out
          </button>
        </form>
      </div>
    </details>
  );
}
