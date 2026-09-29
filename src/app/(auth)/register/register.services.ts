import "server-only";
import { authRequest } from "@/lib/auth-api";
import type { RegisterValues } from "./register.interface";

export async function registerUser(values: RegisterValues): Promise<void> {
  const { name, email, password, rePassword, phone } = values;
  await authRequest("/auth/signup", {
    name,
    email,
    password,
    rePassword,
    phone,
  });
  // The signup token is deliberately discarded; registration never creates a session.
}
