import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

type SyncInput = {
  email: string;
  password: string;
  name: string;
};

function isAlreadyExistsError(message: string | undefined) {
  const normalized = message?.toLowerCase() ?? "";
  return normalized.includes("already exists") || normalized.includes("user already");
}

async function removeNeonAuthUserByEmail(email: string) {
  await prisma.$executeRaw`
    DELETE FROM neon_auth.session
    WHERE "userId" IN (SELECT id FROM neon_auth."user" WHERE email = ${email})
  `;
  await prisma.$executeRaw`
    DELETE FROM neon_auth.account
    WHERE "userId" IN (SELECT id FROM neon_auth."user" WHERE email = ${email})
  `;
  await prisma.$executeRaw`
    DELETE FROM neon_auth."user" WHERE email = ${email}
  `;
}

export async function syncLegacyCredentialToNeonAuth({
  email,
  password,
  name,
}: SyncInput) {
  const { error: signInError } = await auth.signIn.email({ email, password });
  if (!signInError) {
    return { ok: true as const };
  }

  const { error: signUpError } = await auth.signUp.email({ email, password, name });
  if (!signUpError) {
    return { ok: true as const };
  }

  if (!isAlreadyExistsError(signUpError.message)) {
    return {
      ok: false as const,
      error: signUpError.message || "Failed to migrate account to Neon Auth",
    };
  }

  await removeNeonAuthUserByEmail(email);

  const { error: recreateError } = await auth.signUp.email({ email, password, name });
  if (recreateError) {
    return {
      ok: false as const,
      error: recreateError.message || "Failed to reset Neon Auth credentials",
    };
  }

  const { error: retrySignInError } = await auth.signIn.email({ email, password });
  if (retrySignInError) {
    return {
      ok: false as const,
      error: retrySignInError.message || "Credentials synced but sign-in failed",
    };
  }

  return { ok: true as const };
}
