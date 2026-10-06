import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/search";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  if (!rateLimit(`search:${clientIp(req)}`, 60)) return NextResponse.json({ suggestions: [] }, { status: 429 });
  const r = await searchAll(req.nextUrl.searchParams.get("q") ?? "", 5);
  const suggestions = [
    ...r.categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}`, type: "Category" })),
    ...r.products.map((p) => ({ label: p.name, href: `/products/${p.slug}`, type: "Product" })),
    ...r.posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}`, type: "Article" })),
  ];
  return NextResponse.json({ suggestions });
}
