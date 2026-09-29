"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { useRecoverySubmission } from "../_recovery/useRecoverySubmission";
import { resetPasswordAction } from "./reset-password.actions";
import {
  type ResetPasswordValues,
  resetPasswordSchema,
} from "./reset-password.schemas";

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const { pending, message, run } = useRecoverySubmission();
  return (
    <form
      className="recovery-form"
      noValidate
      aria-busy={Boolean(pending)}
      onSubmit={handleSubmit((values) =>
        run(
          "submit",
          () => resetPasswordAction(values),
          () => reset(),
        ),
      )}
    >
      <fieldset disabled={Boolean(pending)}>
        <div className="recovery-field">
          <label htmlFor="new-password">New Password</label>
          <PasswordInput
            login
            id="new-password"
            placeholder="Enter new password"
            autoComplete="new-password"
            {...register("newPassword")}
            aria-invalid={Boolean(errors.newPassword)}
            aria-describedby={
              errors.newPassword ? "new-password-error" : undefined
            }
          />
          {errors.newPassword && (
            <p className="recovery-error" id="new-password-error" role="alert">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="recovery-field">
          <label htmlFor="confirm-password">Confirm Password</label>
          <PasswordInput
            login
            id="confirm-password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <p
              className="recovery-error"
              id="confirm-password-error"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {message && (
          <p className="recovery-error" role="alert">
            {message}
          </p>
        )}
        <Button
          className="recovery-submit"
          type="submit"
          disabled={Boolean(pending)}
        >
          {pending ? "Resetting password…" : "Reset Password"}
        </Button>
      </fieldset>
    </form>
  );
}
