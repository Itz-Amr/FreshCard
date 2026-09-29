"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordAction, updateProfileAction } from "../settings.actions";
import {
  type PasswordValues,
  type ProfileUser,
  type ProfileValues,
  passwordSchema,
  profileSchema,
  type SettingsResult,
} from "../settings.schemas";

function SettingsIcon({
  name,
}: {
  name: "profile" | "lock" | "save" | "lock-white";
}) {
  const large = name === "profile" || name === "lock";
  return (
    <Image
      src={
        name === "lock-white"
          ? "/assets/cart/lock.svg"
          : `/assets/settings/${name}.svg`
      }
      width={large ? 30 : 20}
      height={large ? 24 : 16}
      alt=""
      unoptimized
    />
  );
}
export default function SettingsForms({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState<"profile" | "password" | null>(null);
  const [refreshing, startTransition] = useTransition();
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordKey, setPasswordKey] = useState(0);
  const disabled = !!pending || refreshing;
  const profile = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, phone: user.phone },
  });
  const password = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });
  async function submit(
    kind: "profile" | "password",
    action: () => Promise<SettingsResult>,
  ) {
    if (lock.current || disabled) return;
    lock.current = true;
    setPending(kind);
    const setError = kind === "profile" ? setProfileError : setPasswordError;
    setError("");
    try {
      const result = await action();
      if (!result.success) {
        if (result.code === "login") {
          toast.error(result.message);
          router.replace("/login");
          router.refresh();
          return;
        }
        setError(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(
        result.message === "success"
          ? kind === "profile"
            ? "Profile updated successfully"
            : "Password changed successfully"
          : result.message,
      );
      if (result.user)
        profile.reset({
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
        });
      if (kind === "password") {
        password.reset();
        setPasswordKey((key) => key + 1);
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Unable to save your changes. Please try again.");
      toast.error("Unable to save your changes. Please try again.");
    } finally {
      setPending(null);
      lock.current = false;
    }
  }
  return (
    <div className="settings-content">
      <div className="settings-heading">
        <h2>Account Settings</h2>
        <p>Update your profile information and change your password</p>
      </div>
      <section className="settings-card" aria-labelledby="profile-info-title">
        <div className="settings-card-body">
          <div className="settings-section-heading">
            <span>
              <SettingsIcon name="profile" />
            </span>
            <div>
              <h3 id="profile-info-title">Profile Information</h3>
              <p>Update your personal details</p>
            </div>
          </div>
          <form
            noValidate
            onSubmit={profile.handleSubmit((values) =>
              submit("profile", () => updateProfileAction(values)),
            )}
            aria-busy={pending === "profile"}
          >
            <fieldset disabled={disabled}>
              {(
                [
                  ["name", "Full Name", "text", "name", "Enter your name"],
                  [
                    "email",
                    "Email Address",
                    "email",
                    "email",
                    "Enter your email",
                  ],
                  ["phone", "Phone Number", "tel", "tel", "01xxxxxxxxx"],
                ] as const
              ).map(([field, label, type, autoComplete, placeholder]) => (
                <div className="settings-field" key={field}>
                  <label htmlFor={`settings-${field}`}>{label}</label>
                  <Input
                    id={`settings-${field}`}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    {...profile.register(field)}
                    aria-invalid={!!profile.formState.errors[field]}
                    aria-describedby={
                      profile.formState.errors[field]
                        ? `settings-${field}-error`
                        : undefined
                    }
                  />
                  {profile.formState.errors[field] && (
                    <p
                      className="settings-error"
                      id={`settings-${field}-error`}
                      role="alert"
                    >
                      {profile.formState.errors[field]?.message}
                    </p>
                  )}
                </div>
              ))}
              {profileError && (
                <p role="alert" className="settings-error">
                  {profileError}
                </p>
              )}
              <Button
                type="submit"
                className="settings-save"
                disabled={disabled}
              >
                <SettingsIcon name="save" />
                {pending === "profile" ? "Saving…" : "Save Changes"}
              </Button>
            </fieldset>
          </form>
        </div>
        <div className="settings-account-info">
          <h4>Account Information</h4>
          <dl>
            <div>
              <dt>User ID</dt>
              <dd>–</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd className="settings-role">{user.role}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section
        className="settings-card"
        aria-labelledby="change-password-title"
      >
        <div className="settings-card-body">
          <div className="settings-section-heading settings-password-heading">
            <span>
              <SettingsIcon name="lock" />
            </span>
            <div>
              <h3 id="change-password-title">Change Password</h3>
              <p>Update your account password</p>
            </div>
          </div>
          <form
            noValidate
            onSubmit={password.handleSubmit((values) =>
              submit("password", () => changePasswordAction(values)),
            )}
            aria-busy={pending === "password"}
          >
            <fieldset disabled={disabled} key={passwordKey}>
              {(
                [
                  [
                    "currentPassword",
                    "Current Password",
                    "Enter your current password",
                  ],
                  ["password", "New Password", "Enter your new password"],
                  [
                    "rePassword",
                    "Confirm New Password",
                    "Confirm your new password",
                  ],
                ] as const
              ).map(([field, label, placeholder]) => (
                <div className="settings-field" key={field}>
                  <label htmlFor={`settings-${field}`}>{label}</label>
                  <PasswordInput
                    id={`settings-${field}`}
                    placeholder={placeholder}
                    autoComplete={
                      field === "currentPassword"
                        ? "current-password"
                        : "new-password"
                    }
                    {...password.register(field)}
                    aria-invalid={!!password.formState.errors[field]}
                    aria-describedby={
                      password.formState.errors[field]
                        ? `settings-${field}-error`
                        : field === "password"
                          ? "settings-password-help"
                          : undefined
                    }
                  />
                  {field === "password" && (
                    <p
                      className="settings-password-help"
                      id="settings-password-help"
                    >
                      Use at least 8 characters with a letter, number, and
                      symbol.
                    </p>
                  )}
                  {password.formState.errors[field] && (
                    <p
                      className="settings-error"
                      id={`settings-${field}-error`}
                      role="alert"
                    >
                      {password.formState.errors[field]?.message}
                    </p>
                  )}
                </div>
              ))}
              {passwordError && (
                <p role="alert" className="settings-error">
                  {passwordError}
                </p>
              )}
              <Button
                type="submit"
                className="settings-change-password"
                disabled={disabled}
              >
                <SettingsIcon name="lock-white" />
                {pending === "password"
                  ? "Changing password…"
                  : "Change Password"}
              </Button>
            </fieldset>
          </form>
        </div>
      </section>
    </div>
  );
}
