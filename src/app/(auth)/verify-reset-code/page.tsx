import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RecoveryShell from "../_recovery/RecoveryShell";
import { getRecoveryEmail } from "../_recovery/recovery.context";
import VerifyResetCodeForm from "./VerifyResetCodeForm";

export const metadata: Metadata = {
  title: "Verify Reset Code | FreshCart",
  robots: { index: false, follow: false },
};
export default async function VerifyResetCodePage() {
  const email = await getRecoveryEmail();
  if (!email) redirect("/forgot-password");
  return (
    <RecoveryShell email={email}>
      <VerifyResetCodeForm />
    </RecoveryShell>
  );
}
