import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RecoveryShell from "../_recovery/RecoveryShell";
import { getRecoveryEmail } from "../_recovery/recovery.context";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | FreshCart",
  robots: { index: false, follow: false },
};
export default async function ResetPasswordPage() {
  if (!(await getRecoveryEmail())) redirect("/forgot-password");
  return (
    <RecoveryShell reset>
      <ResetPasswordForm />
    </RecoveryShell>
  );
}
