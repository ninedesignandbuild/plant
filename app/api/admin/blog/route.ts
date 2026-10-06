import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, requireAdmin } from "@/lib/admin";
import { blogSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";
import { BlogPost } from "@/models/BlogPost";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = blogSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  await connectDB();
  try {
    const p = await BlogPost.create({ ...d, slug: d.slug || slugify(d.title), featuredImage: d.featuredImage || undefined, publishedAt: d.isPublished ? new Date() : undefined });
    return NextResponse.json({ id: String(p._id) });
  } catch (e) { if (isDup(e)) return NextResponse.json({ error: "That slug is already used." }, { status: 409 }); throw e; }
}
