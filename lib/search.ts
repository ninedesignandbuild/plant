import { connectDB } from "./mongodb";
import { esc } from "./products";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { BlogPost } from "@/models/BlogPost";
import type { CardProduct } from "@/components/ProductCard";
import type { Post } from "@/components/BlogCard";

export type Results = { products: CardProduct[]; categories: { name: string; slug: string }[]; posts: Post[] };

export async function searchAll(raw: string, limit = 12): Promise<Results> {
  const q = raw.trim().slice(0, 60);
  if (q.length < 2) return { products: [], categories: [], posts: [] };
  const re = { $regex: esc(q), $options: "i" };
  await connectDB();
  const [products, categories, posts] = await Promise.all([
    Product.find({ isActive: true, $or: [{ name: re }, { shortDescription: re }] }).limit(limit).lean(),
    Category.find({ isActive: true, name: re }).limit(4).lean(),
    BlogPost.find({ isPublished: true, title: re }).limit(Math.min(limit, 6)).lean(),
  ]);
  return JSON.parse(JSON.stringify({ products, categories, posts }));
}
