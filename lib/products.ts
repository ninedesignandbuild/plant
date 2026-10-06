import { z } from "zod";
import { connectDB } from "./mongodb";
import { Product } from "@/models/Product";
import type { CardProduct } from "@/components/ProductCard";

const txt = z.string().max(80);
export const ListQuery = z.object({
  q: txt.optional(), light: txt.optional(),
  category: z.string().regex(/^[a-z0-9-]+$/).optional(),
  care: z.enum(["easy", "medium", "expert"]).optional(),
  sort: z.enum(["newest", "price-low", "price-high", "best", "rated"]).default("newest"),
  minPrice: z.coerce.number().min(0).optional(), maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.literal("1").optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});
export type ListQuery = z.infer<typeof ListQuery>;

export const cleanParams = (raw: Record<string, unknown>) => Object.fromEntries(Object.entries(raw).filter(([, v]) => typeof v === "string" && v !== ""));
export function parseListQuery(raw: Record<string, unknown>) {
  const r = ListQuery.safeParse(cleanParams(raw));
  return r.success ? r.data : ListQuery.parse({});
}

export const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SORT = { newest: { createdAt: -1 }, "price-low": { price: 1 }, "price-high": { price: -1 }, best: { isBestSeller: -1, reviewCount: -1 }, rated: { ratings: -1, reviewCount: -1 } } as const;

export async function listProducts(v: ListQuery) {
  const f: Record<string, unknown> = { isActive: true };
  if (v.category) f.category = v.category;
  if (v.q) f.name = { $regex: esc(v.q), $options: "i" };
  if (v.light) f.lightRequirement = { $regex: esc(v.light), $options: "i" };
  if (v.care) f.careLevel = v.care;
  if (v.inStock) f.stock = { $gt: 0 };
  if (v.minPrice != null || v.maxPrice != null) f.price = { ...(v.minPrice != null && { $gte: v.minPrice }), ...(v.maxPrice != null && { $lte: v.maxPrice }) };
  await connectDB();
  const [items, total] = await Promise.all([
    Product.find(f).sort(SORT[v.sort]).skip((v.page - 1) * v.limit).limit(v.limit).lean(),
    Product.countDocuments(f),
  ]);
  return { items: JSON.parse(JSON.stringify(items)) as CardProduct[], total, page: v.page, pages: Math.max(1, Math.ceil(total / v.limit)) };
}
