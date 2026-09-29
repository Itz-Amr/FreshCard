import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";

type TrustedUpdate = {
  subject: string;
  user: { name: string; email: string; role: string; phone?: string };
  backendToken?: string;
  backendExpiresAt?: number;
};
// Request-scoped authority, populated only after a successful backend mutation.
// Browser POST /api/auth/session payloads can never populate this context.
const updates = new AsyncLocalStorage<TrustedUpdate>();
export function withTrustedAuthUpdate<T>(
  update: TrustedUpdate,
  run: () => Promise<T>,
) {
  return updates.run(update, run);
}
export function trustedAuthUpdate() {
  return updates.getStore();
}
