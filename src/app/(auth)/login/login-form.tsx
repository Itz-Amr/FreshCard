"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthIcon } from "@/components/auth/auth-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "./login.actions";
import type { LoginValues } from "./login.interface";
import { loginSchema } from "./login.zod";

export default function LoginForm({
  initialMessage = "",
}: {
  initialMessage?: string;
}) {
  const router = useRouter();
  const locked = useRef(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(initialMessage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });
  function submit(values: LoginValues) {
    if (locked.current) return;
    locked.current = true;
    setMessage("");
    startTransition(async () => {
      try {
        const result = await loginAction(values);
        if (!result.success) {
          setMessage(result.message);
          toast.error(result.message);
          locked.current = false;
          return;
        }
        toast.success("Welcome back to FreshCart!");
        router.replace("/");
        router.refresh();
      } catch {
        setMessage("Unable to connect. Please try again.");
        toast.error("Unable to connect. Please try again.");
        locked.current = false;
      }
    });
  }
  return (
    <section className="auth-card login-card" aria-labelledby="login-title">
      <div className="login-intro">
        <Link href="/" className="auth-wordmark">
          <span>Fresh</span>Cart
        </Link>
        <h1 id="login-title">Welcome Back!</h1>
        <p className="auth-subtitle">
          Sign in to continue your fresh shopping experience
        </p>
      </div>
      <form
        className="login-form"
        noValidate
        onSubmit={handleSubmit(submit)}
        aria-busy={pending}
      >
        <fieldset disabled={pending}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrap with-icon">
              <AuthIcon name="email" />
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby="email-error"
              />
            </div>
            <p
              className="field-error"
              id="email-error"
              role={errors.email ? "alert" : undefined}
            >
              {errors.email?.message}
            </p>
          </div>
          <div className="auth-field">
            <div className="password-label">
              <label htmlFor="login-password">Password</label>
              <Link href="/forgot-password" className="auth-text-link">
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              login
              id="login-password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-error"
            />
            <p
              className="field-error"
              id="password-error"
              role={errors.password ? "alert" : undefined}
            >
              {errors.password?.message}
            </p>
          </div>
          <label
            className="auth-checkbox"
            title="Stay signed in for up to 30 days; otherwise up to 1 day. Backend token expiry may end the session earlier."
          >
            <input type="checkbox" {...register("remember")} />
            <span>Keep me signed in</span>
          </label>
          {message && (
            <p className="auth-error" role="alert">
              {message}
            </p>
          )}
          <Button type="submit" className="auth-submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign In"}
          </Button>
        </fieldset>
      </form>
      <p className="login-switch">
        New to FreshCart? <Link href="/register">Create an account</Link>
      </p>
    </section>
  );
}
