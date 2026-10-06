import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../config";

const opt = (n: number) => z.string().trim().max(n).optional();
export const productSchema = z.object({
  name: z.string().trim().min(2).max(120), category: z.string().regex(/^[a-z0-9-]+$/),
  price: z.number().min(0), compareAtPrice: z.number().min(0).nullable().optional(), stock: z.number().int().min(0),
  sku: opt(40), shortDescription: opt(200), description: opt(5000), lightRequirement: opt(60), waterRequirement: opt(60), height: opt(40), potSize: opt(40),
  careLevel: z.enum(["easy", "medium", "expert"]),
  images: z.array(z.string().startsWith("https://res.cloudinary.com/")).max(8),
  petFriendly: z.boolean(), isFeatured: z.boolean(), isBestSeller: z.boolean(), isNewArrival: z.boolean(), isActive: z.boolean(),
});
export const orderUpdateSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES).optional(), paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  trackingNumber: opt(60), shippingProvider: opt(60),
});
export const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, "Use 3–20 letters or numbers"),
  type: z.enum(["percent", "fixed"]), value: z.number().positive(),
  minOrder: z.number().min(0).default(0), maxDiscount: z.number().positive().optional(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), usageLimit: z.number().int().positive().optional(),
}).refine((c) => c.type !== "percent" || c.value <= 100, "Percentage can't exceed 100");

import { BLOG_CATEGORIES } from "../content";
export const blogSchema = z.object({
  title: z.string().trim().min(3).max(150), slug: z.string().regex(/^[a-z0-9-]*$/).max(100).optional(),
  featuredImage: z.string().startsWith("https://res.cloudinary.com/").optional().or(z.literal("")),
  excerpt: z.string().trim().max(300).optional(), content: z.string().trim().min(20).max(20000), author: z.string().trim().max(60).optional(),
  category: z.enum(BLOG_CATEGORIES), tags: z.array(z.string().trim().min(1).max(30)).max(10), isPublished: z.boolean(),
  seoTitle: z.string().trim().max(70).optional(), seoDescription: z.string().trim().max(160).optional(),
});

export const categorySchema = z.object({ name: z.string().trim().min(2).max(60), description: z.string().trim().max(300).optional(), order: z.number().int().min(0).max(999), isActive: z.boolean() });
const link = z.string().url().startsWith("https://").or(z.literal(""));
export const settingsSchema = z.object({
  nurseryName: z.string().trim().min(2).max(60), phone: z.string().trim().max(30), email: z.string().email().or(z.literal("")),
  whatsapp: z.string().regex(/^\d{0,15}$/, "Digits only, with country code (e.g. 919876543210)"),
  address: z.string().trim().max(200), openingHours: z.string().trim().max(120),
  mapsEmbedUrl: z.string().startsWith("https://www.google.com/maps/embed").or(z.literal("")),
  standardFee: z.number().min(0), expressFee: z.number().min(0), freeAbove: z.number().min(0), minOrder: z.number().min(0), codEnabled: z.boolean(),
  instagram: link, facebook: link, youtube: link,
});
