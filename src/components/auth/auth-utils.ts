import { authClient } from "@/lib/auth/client";

const AUTH_EMAIL_KEY = "catalogger_auth_email";
const CART_STORAGE_KEY = "catalogger-cart";

export function clearClientAuthArtifacts() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
}

/** Clear client artifacts when Neon session email changes (e.g. switched Google account). */
export function syncAuthEmailChange(currentEmail?: string | null) {
  if (typeof window === "undefined" || !currentEmail) return;

  const normalized = currentEmail.toLowerCase();
  const previous = sessionStorage.getItem(AUTH_EMAIL_KEY);

  if (previous && previous !== normalized) {
    clearClientAuthArtifacts();
  }

  sessionStorage.setItem(AUTH_EMAIL_KEY, normalized);
}

export async function signOutCompletely(redirectTo = "/login") {
  clearClientAuthArtifacts();
  await authClient.signOut();
  window.location.href = redirectTo;
}

export async function ensureFreshOAuthSession() {
  clearClientAuthArtifacts();
  await authClient.signOut();
}

export async function ensureAppSession(retries = 5): Promise<{ ok: boolean; role?: string }> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch("/api/auth/app-session", {
      cache: "no-store",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, role: data.user?.role };
    }

    await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)));
  }

  return { ok: false };
}

export function getDashboardPath(role?: string) {
  return role === "SUPER_ADMIN" ? "/platform/dashboard" : "/dashboard";
}

export function getStoreSetupPath() {
  return "/signup";
}

export async function resolvePostAuthRedirect(): Promise<string> {
  const { ok, role } = await ensureAppSession();
  if (ok) return getDashboardPath(role);
  return getStoreSetupPath();
}
