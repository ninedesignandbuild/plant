import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { BlogPost } from "@/models/BlogPost";
import { Category } from "@/models/Category";

type Doc = { slug: string; updatedAt?: Date };
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages: MetadataRoute.Sitemap = ["", "/shop", "/services", "/services/book", "/blog", "/contact", "/about", "/nursery", "/faqs", "/shipping", "/returns", "/privacy", "/terms"].map((p) => ({ url: `${base}${p}` }));
  try {
    await connectDB();
    const [products, posts, cats]: Doc[][] = await Promise.all([Product.find({ isActive: true }), BlogPost.find({ isPublished: true }), Category.find({ isActive: true })].map((q) => q.select("slug updatedAt").lean()));
    return [...pages, ...products.map((d) => ({ url: `${base}/products/${d.slug}`, lastModified: d.updatedAt })), ...posts.map((d) => ({ url: `${base}/blog/${d.slug}`, lastModified: d.updatedAt })), ...cats.map((d) => ({ url: `${base}/shop/${d.slug}` }))];
  } catch { return pages; }
}
