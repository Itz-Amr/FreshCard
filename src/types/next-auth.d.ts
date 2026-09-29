import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    backendToken?: string;
    backendExpiresAt?: number;
    sessionDeadline?: number;
  }
  interface Session {
    user: { id: string; role: string; phone?: string } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    phone?: string;
    role?: string;
    backendToken?: string;
    backendExpiresAt?: number;
    sessionDeadline?: number;
  }
}
