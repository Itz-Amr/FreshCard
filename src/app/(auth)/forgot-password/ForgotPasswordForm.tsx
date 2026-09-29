"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecoveryIcon from "../_recovery/RecoveryIcon";
import { forgotPasswordAction } from "../_recovery/recovery.actions";
import {
  type ForgotPasswordValues,
  forgotPasswordSchema,
} from "../_recovery/recovery.schemas";
import { useRecoverySubmission } from "../_recovery/useRecoverySubmission";

export default function ForgotPasswordForm({ email = "" }: { email?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email },
  });
  const { pending, message, run } = useRecoverySubmission();
  return (
    <>
      <form
        className="recovery-form"
        noValidate
        aria-busy={Boolean(pending)}
        onSubmit={handleSubmit((values) =>
          run("submit", () => forgotPasswordAction(values)),
        )}
      >
        <fieldset disabled={Boolean(pending)}>
          <div className="recovery-field">
            <label htmlFor="recovery-email">Email Address</label>
            <div className="recovery-input-wrap">
              <RecoveryIcon name="field" />
              <Input
                id="recovery-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "recovery-email-error" : undefined
                }
              />
            </div>
            {errors.email && (
              <p
                id="recovery-email-error"
                className="recovery-error"
                role="alert"
              >
                {errors.email.message}
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
            {pending ? "Sending code…" : "Send Reset Code"}
          </Button>
          <Link className="recovery-back" href="/login">
            <RecoveryIcon name="17" />
            Back to Sign In
          </Link>
        </fieldset>
      </form>
      <p className="recovery-signin">
        Remember your password? <Link href="/login">Sign In</Link>
      </p>
    </>
  );
}
