import "server-only";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "@/app/(auth)/login/login.services";
import { loginSchema } from "@/app/(auth)/login/login.zod";
import { AuthApiError } from "@/lib/auth-api";
import { trustedAuthUpdate } from "@/lib/auth-update-context";
import { tokenIsUsable } from "@/lib/token-policy";

export const secureCookies = process.env.NODE_ENV === "production";

export const authConfig = {
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 86400 },
  useSecureCookies: secureCookies,
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, remember: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          ...credentials,
          remember:
            credentials.remember === "true" || credentials.remember === true,
        });
        if (!parsed.success) return null;
        try {
          return await loginUser(parsed.data);
        } catch (error) {
          if (error instanceof AuthApiError && error.kind === "credentials")
            return null;
          throw new Error("Authentication service unavailable");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.backendToken = user.backendToken;
        token.backendExpiresAt = user.backendExpiresAt;
        token.sessionDeadline = user.sessionDeadline;
      }
      if (trigger === "update" && tokenIsUsable(token)) {
        const update = trustedAuthUpdate();
        if (update && update.subject === token.sub) {
          token.name = update.user.name;
          token.email = update.user.email;
          token.sub = update.user.email;
          token.role = update.user.role;
          if (update.user.phone !== undefined) token.phone = update.user.phone;
          if (update.backendToken && update.backendExpiresAt) {
            token.backendToken = update.backendToken;
            token.backendExpiresAt = update.backendExpiresAt;
            token.sessionDeadline = Math.min(
              token.sessionDeadline ?? 0,
              update.backendExpiresAt,
            );
          }
        }
      }
      return tokenIsUsable(token) ? token : null;
    },
    async session({ session, token }) {
      // Whitelist fields: never spread the JWT into a client-facing session.
      return {
        expires: new Date(
          Math.min(
            Date.parse(session.expires),
            (token.sessionDeadline ?? 0) * 1000,
          ),
        ).toISOString(),
        user: {
          id: token.sub ?? "",
          name: token.name,
          email: token.email,
          role: token.role ?? "user",
          ...(token.phone !== undefined ? { phone: token.phone } : {}),
        },
      };
    },
  },
  logger: {
    error(error) {
      console.error("[auth]", error.name);
    },
    warn(code) {
      console.warn("[auth]", code);
    },
  },
} satisfies NextAuthConfig;
