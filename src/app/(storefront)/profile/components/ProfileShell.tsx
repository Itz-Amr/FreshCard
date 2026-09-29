import Link from "next/link";
import type { ReactNode } from "react";
import ProfileIcon from "./ProfileIcon";
import "../profile.css";

export default function ProfileShell({
  children,
  active = "addresses",
}: {
  children: ReactNode;
  active?: "addresses" | "settings";
}) {
  return (
    <section
      className={`profile-page ${active === "settings" ? "profile-settings-page" : ""}`}
    >
      <div className="profile-hero">
        <div className="profile-container">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>My Account</span>
          </nav>
          <div className="profile-hero-title">
            <span className="profile-hero-icon">
              <ProfileIcon name="account" />
            </span>
            <div>
              <h1>My Account</h1>
              <p>Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-container profile-columns">
        <aside>
          <nav className="profile-sidebar" aria-label="My Account">
            <h2>My Account</h2>
            <div>
              <Link
                href="/profile/addresses"
                aria-current={active === "addresses" ? "page" : undefined}
              >
                <span>
                  <ProfileIcon
                    name={
                      active === "addresses"
                        ? "address-active"
                        : "address-inactive"
                    }
                  />
                </span>
                My Addresses
                <ProfileIcon
                  name={active === "addresses" ? "chevron-active" : "chevron"}
                />
              </Link>
              <Link
                href="/profile/settings"
                aria-current={active === "settings" ? "page" : undefined}
              >
                <span>
                  <ProfileIcon
                    name={
                      active === "settings" ? "settings-active" : "settings"
                    }
                  />
                </span>
                Settings
                <ProfileIcon
                  name={active === "settings" ? "chevron-active" : "chevron"}
                />
              </Link>
            </div>
          </nav>
        </aside>
        <div className="profile-content">{children}</div>
      </div>
    </section>
  );
}
