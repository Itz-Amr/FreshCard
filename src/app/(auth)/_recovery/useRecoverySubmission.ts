"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { RecoveryResult } from "./recovery.schemas";

export function useRecoverySubmission() {
  const router = useRouter();
  const locked = useRef(false);
  const [pending, setPending] = useState<"submit" | "resend" | null>(null);
  const [message, setMessage] = useState("");
  async function run(
    kind: "submit" | "resend",
    action: () => Promise<RecoveryResult>,
    clear?: () => void,
  ) {
    if (locked.current) return;
    locked.current = true;
    setPending(kind);
    setMessage("");
    let navigating = false;
    try {
      const result = await action();
      if (!result.success) {
        setMessage(result.message);
        toast.error(result.message);
        if (result.restart) {
          navigating = true;
          router.replace("/forgot-password");
        }
        return;
      }
      clear?.();
      toast.success(result.message);
      if (result.next) {
        navigating = true;
        router.replace(result.next);
      }
    } catch {
      const text = "Unable to connect. Please try again.";
      setMessage(text);
      toast.error(text);
    } finally {
      if (!navigating) {
        locked.current = false;
        setPending(null);
      }
    }
  }
  return { pending, message, run };
}
