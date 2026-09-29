import type { Metadata } from "next";
import RecoveryShell from "../_recovery/RecoveryShell";
import { getRecoveryEmail } from "../_recovery/recovery.context";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | FreshCart",
  robots: { index: false, follow: false },
};
export default async function ForgotPasswordPage() {
  const email = await getRecoveryEmail();
  return (
    <RecoveryShell>
      <ForgotPasswordForm email={email ?? ""} />
    </RecoveryShell>
  );
}
