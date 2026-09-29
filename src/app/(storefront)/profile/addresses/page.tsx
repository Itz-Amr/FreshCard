import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SessionRequiredError } from "@/lib/backend";
import ProfileShell from "../components/ProfileShell";
import type { Address } from "./addresses.schemas";
import { AddressApiError, getAddresses } from "./addresses.services";
import AddressesContent from "./components/AddressesContent";

export const metadata: Metadata = { title: "My Addresses | FreshCart" };
export default async function AddressesPage() {
  let addresses: Address[] | undefined;
  let message: string | undefined;
  let guest = false;
  try {
    addresses = await getAddresses();
  } catch (error) {
    guest = error instanceof SessionRequiredError;
    message =
      error instanceof AddressApiError
        ? error.message
        : "Unable to load your addresses. Please try again.";
  }
  if (guest) redirect("/login");
  return (
    <ProfileShell>
      <AddressesContent addresses={addresses} error={message} />
    </ProfileShell>
  );
}
