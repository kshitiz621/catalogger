import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export const StoreUpdateSchema = z.object({
  name: z.string().min(1, "Store name is required").trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(48, "Slug must be 48 characters or fewer")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens.")
    .trim()
    .toLowerCase(),
  whatsappNumber: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val.replace(/\D/g, "") : null))
    .refine((val) => !val || (val.length >= 10 && val.length <= 15), {
      message: "WhatsApp number must be between 10 and 15 digits (with country code, e.g. 919876543210)",
    }),
  logoUrl: z.string().url("Invalid URL").optional().nullable(),
  storeTitle: z.string().optional().nullable(),
  showCategoryImages: z.boolean().default(false),
  categoryImageStyle: z.enum(["square", "rounded"]).default("square"),
  themeColor: z.string().default("#E11D48"),
  headerCode: z.string().optional().nullable(),
  footerCode: z.string().optional().nullable(),
  productsPerRow: z
    .number()
    .int()
    .min(2)
    .max(8)
    .default(4)
    .or(
      z.string().regex(/^\d+$/).transform(Number).refine((n) => n >= 2 && n <= 8)
    )
    .default(4),
  fontFamily: z
    .enum(["Inter", "Outfit", "Playfair Display", "Plus Jakarta Sans", "Lora", "Montserrat", "Caveat"])
    .default("Inter"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  fontWeight: z.enum(["normal", "medium", "semibold", "bold", "black"]).default("semibold"),
  cardRadius: z.enum(["none", "sm", "md", "lg", "xl", "full"]).default("lg"),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Valid category name is required").trim(),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Valid product name is required").trim(),
  price: z.number().positive("Valid numeric price > 0 is required"),
  description: z.string().trim().optional().nullable(),
  imageUrl: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  categoryId: z.string().optional().nullable().or(z.literal("")),
});

export const PlatformSettingsSchema = z.object({
  platformName: z.string().min(2, "Platform name must be at least 2 characters").max(50),
  logoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  supportEmail: z.string().email("Must be a valid email").optional().nullable().or(z.literal("")),
  registrationEnabled: z.boolean(),
  maintenanceMode: z.boolean(),
});

export const SellerCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeSlug: z.string().min(2, "Store slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export const SellerUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeSlug: z.string().min(2, "Store slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});
