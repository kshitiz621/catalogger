import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  NEON_AUTH_BASE_URL: z.string().url().optional(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(16).optional(),
  MAINTENANCE_MODE: z.enum(["true", "false"]).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_UPLOAD_PROVIDER: z.enum(["mock", "cloudinary", "s3"]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function parseEnv<T extends z.ZodTypeAny>(schema: T, source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);
  if (!result.success && process.env.NODE_ENV === "production") {
    console.error("Invalid environment configuration:", result.error.flatten().fieldErrors);
  }
  return result.success ? result.data : ({} as z.infer<T>);
}

export const serverEnv = parseEnv(serverSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
  NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
});

export const clientEnv = parseEnv(clientSchema, {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_UPLOAD_PROVIDER: process.env.NEXT_PUBLIC_UPLOAD_PROVIDER,
});

export function getAppUrl(): string {
  return (
    clientEnv.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function isMaintenanceMode(): boolean {
  return serverEnv.MAINTENANCE_MODE === "true";
}
