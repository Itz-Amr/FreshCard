import "server-only";
import NextAuth from "next-auth";
import { authConfig } from "@/authConfig/authConfig";

export const {
  auth,
  signIn,
  signOut,
  handlers,
  unstable_update: updateSession,
} = NextAuth(authConfig);
