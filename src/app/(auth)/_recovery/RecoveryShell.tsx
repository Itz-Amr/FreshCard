import Link from "next/link";
import type { ReactNode } from "react";
import RecoveryIcon from "./RecoveryIcon";
import "./recovery.css";

export default function RecoveryShell({
  children,
  email,
  reset = false,
}: {
  children: ReactNode;
  email?: string;
  reset?: boolean;
}) {
  const verify = email !== undefined && !reset;
  return (
    <div
      className={`recovery-grid${verify ? " recovery-verify" : reset ? " recovery-reset" : ""}`}
    >
      <section className="recovery-hero" aria-labelledby="recovery-title">
        <div className="recovery-art" aria-hidden="true">
          <i className="recovery-circle circle-one" />
          <i className="recovery-circle circle-two" />
          <i className="recovery-circle circle-three" />
          <div className="recovery-composition">
            <div className="recovery-lock">
              <div>
                <RecoveryIcon name="7" />
              </div>
            </div>
            <div className="recovery-envelope">
              <RecoveryIcon name="8" />
            </div>
            <div className="recovery-shield">
              <RecoveryIcon name="9" />
            </div>
            <div className="recovery-dots">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <h2 id="recovery-title">Reset Your Password</h2>
        <p>
          Don&apos;t worry, it happens to the best of us. We&apos;ll help you
          get back into your account in no time.
        </p>
        <div className="recovery-trust">
          {["Email Verification", "Secure Reset", "Encrypted"].map(
            (label, i) => (
              <span key={label}>
                <RecoveryIcon name={String(10 + i)} />
                {label}
              </span>
            ),
          )}
        </div>
      </section>
      <section className="recovery-card" aria-labelledby="recovery-heading">
        <div className="recovery-intro">
          <Link href="/" className="recovery-wordmark">
            <span>Fresh</span>Cart
          </Link>
          <h1 id="recovery-heading">
            {reset
              ? "Create New Password"
              : verify
                ? "Check Your Email"
                : "Forgot Password?"}
          </h1>
          <p>
            {reset ? (
              "Your new password must be different from previous passwords"
            ) : verify ? (
              <>
                Enter the 6-digit code sent to{" "}
                <span className="recovery-email">{email}</span>
              </>
            ) : (
              "No worries, we'll send you a reset code"
            )}
          </p>
        </div>
        <ol
          className="recovery-progress"
          aria-label="Password recovery progress"
        >
          <li
            className={`complete${!verify && !reset ? " current" : ""}`}
            aria-current={!verify && !reset ? "step" : undefined}
          >
            <RecoveryIcon name={verify || reset ? "verify-13" : "13"} />
            <span className="sr-only">
              Email verification{verify || reset ? " completed" : ""}
            </span>
          </li>
          <li
            className={reset ? "complete" : verify ? "complete current" : ""}
            aria-current={verify ? "step" : undefined}
          >
            <RecoveryIcon
              name={reset ? "verify-13" : verify ? "verify-14" : "14"}
            />
            <span className="sr-only">
              Verify reset code{reset ? " completed" : ""}
            </span>
          </li>
          <li
            className={reset ? "complete current" : ""}
            aria-current={reset ? "step" : undefined}
          >
            <RecoveryIcon name={reset ? "reset-step" : "15"} />
            <span className="sr-only">Reset password</span>
          </li>
        </ol>
        {children}
      </section>
    </div>
  );
}
