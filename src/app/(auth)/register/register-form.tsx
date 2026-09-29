"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AuthIcon } from "@/components/auth/auth-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "./register.actions";
import type { RegisterValues } from "./register.interface";
import { registerSchema } from "./register.zod";

export default function RegisterForm() {
  const router = useRouter();
  const locked = useRef(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false,
    },
  });
  const password = useWatch({ control, name: "password" });
  const strength = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9\s]/.test(password),
  ].filter(Boolean).length;
  function submit(values: RegisterValues) {
    if (locked.current) return;
    locked.current = true;
    setMessage("");
    startTransition(async () => {
      try {
        const result = await registerAction(values);
        if (!result.success) {
          setMessage(result.message);
          toast.error(result.message);
          locked.current = false;
          return;
        }
        toast.success("Account created! Sign in to start shopping.");
        router.replace("/login");
      } catch {
        setMessage("Unable to connect. Please try again.");
        toast.error("Unable to connect. Please try again.");
        locked.current = false;
      }
    });
  }
  return (
    <section
      className="auth-card register-card"
      aria-labelledby="register-title"
    >
      <h2 id="register-title">Create Your Account</h2>
      <p className="auth-subtitle">Start your fresh journey with us today</p>
      <form
        className="register-form"
        noValidate
        onSubmit={handleSubmit(submit)}
        aria-busy={pending}
      >
        <fieldset disabled={pending}>
          {(
            [
              ["name", "Name", "Ali", "text", "name"],
              ["email", "Email", "ali@example.com", "email", "email"],
              [
                "password",
                "Password",
                "create a strong password",
                "password",
                "new-password",
              ],
              [
                "rePassword",
                "Confirm Password",
                "confirm your password",
                "password",
                "new-password",
              ],
              ["phone", "Phone Number", "01012345678", "tel", "tel"],
            ] as const
          ).map(([name, label, placeholder, type, autoComplete]) => (
            <div className="auth-field" key={name}>
              <label htmlFor={`register-${name}`}>{label}*</label>
              {type === "password" ? (
                <PasswordInput
                  id={`register-${name}`}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  {...register(name)}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={`${name}-error${name === "password" ? " password-help" : ""}`}
                />
              ) : (
                <Input
                  id={`register-${name}`}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  {...register(name)}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={`${name}-error`}
                />
              )}
              {name === "password" && (
                <>
                  <div className="password-strength">
                    <div>
                      <span
                        style={{ width: `${password ? strength * 25 : 0}%` }}
                        data-strength={strength}
                      />
                    </div>
                    <span>
                      {strength === 4
                        ? "Strong"
                        : strength >= 2
                          ? "Fair"
                          : "Weak"}
                    </span>
                  </div>
                  <p id="password-help" className="field-help">
                    Must be at least 8 characters with numbers and symbols
                  </p>
                </>
              )}
              <p
                id={`${name}-error`}
                className="field-error"
                role={errors[name] ? "alert" : undefined}
              >
                {errors[name]?.message}
              </p>
            </div>
          ))}
          <div>
            <label className="auth-checkbox">
              <input
                type="checkbox"
                {...register("terms")}
                aria-invalid={Boolean(errors.terms)}
                aria-describedby="terms-error"
              />
              <span>I agree to the Terms of Service and Privacy Policy *</span>
            </label>
            <p className="field-help">
              Terms of Service and Privacy Policy have not been published.
            </p>
            <p
              id="terms-error"
              className="field-error"
              role={errors.terms ? "alert" : undefined}
            >
              {errors.terms?.message}
            </p>
          </div>
          {message && (
            <p className="auth-error" role="alert">
              {message}
            </p>
          )}
          <Button className="auth-submit" type="submit" disabled={pending}>
            {pending ? (
              "Creating account…"
            ) : (
              <>
                <AuthIcon name="register-17" />
                Create My Account
              </>
            )}
          </Button>
        </fieldset>
      </form>
      <p className="register-switch">
        Already have an account? <Link href="/login">Sign In</Link>
      </p>
    </section>
  );
}
