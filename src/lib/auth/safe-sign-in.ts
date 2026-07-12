"use client";

import { authClient } from "@/lib/auth/client";

type AuthError = { message?: string } | null | undefined;

function normalizeSignInError(message: string) {
  const lower = message.toLowerCase();
  if (
    lower.includes("invalid") &&
    (lower.includes("password") || lower.includes("credential") || lower.includes("email"))
  ) {
    return "Invalid email or password.";
  }
  return message;
}

export async function safeEmailSignIn(email: string, password: string) {
  try {
    const result = await authClient.signIn.email({ email, password });
    const error = result.error as AuthError;
    if (error?.message) {
      return { error: { message: normalizeSignInError(error.message) } };
    }
    return { error };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not reach the auth server.";
    return { error: { message: normalizeSignInError(message) } };
  }
}
