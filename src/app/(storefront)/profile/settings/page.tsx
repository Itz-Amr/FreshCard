import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileShell from "../components/ProfileShell";
import SettingsForms from "./components/SettingsForms";
import "./settings.css";

export const metadata: Metadata = { title: "Account Settings | FreshCart" };
export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <ProfileShell active="settings">
      <SettingsForms
        user={{
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          phone: session.user.phone ?? "",
          role: session.user.role,
        }}
      />
    </ProfileShell>
  );
}
