import type { z } from "zod";
import type { registerSchema } from "./register.zod";

export type RegisterValues = z.infer<typeof registerSchema>;
export type RegisterResult =
  | { success: true }
  | { success: false; message: string };
