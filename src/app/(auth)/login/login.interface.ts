import type { z } from "zod";
import type { loginSchema } from "./login.zod";

export type LoginValues = z.infer<typeof loginSchema>;
export type LoginResult =
  | { success: true }
  | { success: false; message: string };
