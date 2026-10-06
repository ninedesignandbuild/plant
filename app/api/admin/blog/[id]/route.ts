import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { blogSchema } from "@/lib/validations/admin";
import { BlogPost } from "@/models/BlogPost";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  const parsed = blogSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  await connectDB();
  const p = await BlogPost.findById(id);
  if (!p) return notFoundJson();
  p.set({ ...d, slug: d.slug || p.slug, featuredImage: d.featuredImage || undefined });
  if (d.isPublished && !p.publishedAt) p.publishedAt = new Date();
  try { await p.save(); } catch (e) { if (isDup(e)) return NextResponse.json({ error: "That slug is already used." }, { status: 409 }); throw e; }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  return (await BlogPost.findByIdAndDelete(id)) ? NextResponse.json({ ok: true }) : notFoundJson();
}
