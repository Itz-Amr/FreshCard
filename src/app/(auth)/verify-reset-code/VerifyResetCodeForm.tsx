"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecoveryIcon from "../_recovery/RecoveryIcon";
import {
  resendResetCodeAction,
  verifyResetCodeAction,
} from "../_recovery/recovery.actions";
import {
  type VerifyResetCodeValues,
  verifyResetCodeSchema,
} from "../_recovery/recovery.schemas";
import { useRecoverySubmission } from "../_recovery/useRecoverySubmission";

export default function VerifyResetCodeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyResetCodeValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { resetCode: "" },
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
          () => verifyResetCodeAction(values),
          () => reset(),
        ),
      )}
    >
      <fieldset disabled={Boolean(pending)}>
        <div className="recovery-field">
          <label htmlFor="reset-code">Verification Code</label>
          <div className="recovery-code-wrap">
            <Input
              id="reset-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              {...register("resetCode")}
              aria-invalid={Boolean(errors.resetCode)}
              aria-describedby={
                errors.resetCode ? "reset-code-error" : undefined
              }
            />
            <RecoveryIcon name="verify-field" />
          </div>
          {errors.resetCode && (
            <p id="reset-code-error" className="recovery-error" role="alert">
              {errors.resetCode.message}
            </p>
          )}
        </div>
        <p className="recovery-resend">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            disabled={Boolean(pending)}
            onClick={() => run("resend", resendResetCodeAction, () => reset())}
          >
            {pending === "resend" ? "Sending code…" : "Resend Code"}
          </button>
        </p>
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
          {pending === "submit" ? "Verifying…" : "Verify Code"}
        </Button>
        <Link className="recovery-back" href="/forgot-password">
          <RecoveryIcon name="verify-17" />
          Change email address
        </Link>
      </fieldset>
    </form>
  );
}
