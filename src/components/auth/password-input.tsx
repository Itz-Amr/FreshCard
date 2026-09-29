"use client";

import { type ComponentProps, useState } from "react";
import { Input } from "@/components/ui/input";
import { AuthIcon } from "./auth-icon";

export function PasswordInput({
  login = false,
  ...props
}: ComponentProps<typeof Input> & { login?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`auth-input-wrap ${login ? "with-icon" : ""}`}>
      {login && <AuthIcon name="lock" />}
      <Input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-toggle"
        aria-label={`${visible ? "Hide" : "Show"} password`}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        <AuthIcon name="login-14" />
      </button>
    </div>
  );
}
