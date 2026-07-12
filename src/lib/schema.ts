import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export const LegacyLoginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const SellerOAuthSignupSchema = z.object({
  name: z.string().min(2, "Owner name must be at least 2 characters").trim().optional(),
  businessName: z.string().min(2, "Business name must be at least 2 characters").trim(),
  whatsappNumber: z
    .string()
    .min(1, "WhatsApp number is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10 && val.length <= 15, {
      message: "WhatsApp number must be 10–15 digits with country code (e.g. 919876543210)",
    }),
  storeSlug: z
    .string()
    .min(3, "Store slug must be at least 3 characters")
    .max(48, "Store slug must be 48 characters or fewer")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim()
    .toLowerCase(),
});

export const SellerSignupSchema = z.object({
  name: z.string().min(2, "Owner name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters").trim(),
  whatsappNumber: z
    .string()
    .min(1, "WhatsApp number is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10 && val.length <= 15, {
      message: "WhatsApp number must be 10–15 digits with country code (e.g. 919876543210)",
    }),
  storeSlug: z
    .string()
    .min(3, "Store slug must be at least 3 characters")
    .max(48, "Store slug must be 48 characters or fewer")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim()
    .toLowerCase(),
});

export const StoreSlugSchema = z.object({
  slug: z
    .string()
    .min(3, "Store slug must be at least 3 characters")
    .max(48, "Store slug must be 48 characters or fewer")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .trim()
    .toLowerCase(),
});

export const SocialLinksSchema = z.object({
  instagram: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  facebook: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  twitter: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  youtube: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  tiktok: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
  website: z.string().trim().url("Invalid URL").optional().nullable().or(z.literal("")),
});

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #E11D48)");

const optionalUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => (val === "" ? null : val));

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
  logoUrl: optionalUrl,
  bannerUrl: optionalUrl,
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() ? val.trim() : null)),
  storeTitle: z
    .string()
    .max(70, "SEO title must be 70 characters or fewer")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() ? val.trim() : null)),
  seoDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or fewer")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() ? val.trim() : null)),
  seoKeywords: z
    .string()
    .max(200, "Keywords must be 200 characters or fewer")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() ? val.trim() : null)),
  showCategoryImages: z.boolean().default(false),
  categoryImageStyle: z.enum(["square", "rounded"]).default("square"),
  themeColor: hexColor.default("#E11D48"),
  accentColor: hexColor.default("#F43F5E"),
  headerCode: z.string().optional().nullable(),
  footerCode: z.string().optional().nullable(),
  socialLinks: SocialLinksSchema.optional().default({}),
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

export const StorefrontSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .trim()
    .toLowerCase(),
});

export const StorefrontProductQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  categoryId: z.string().optional(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "name-asc", "name-desc"])
    .default("newest"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export const CheckoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10 && val.length <= 15, {
      message: "Phone must be 10–15 digits with country code",
    }),
  note: z.string().max(500, "Note must be 500 characters or fewer").optional(),
});
