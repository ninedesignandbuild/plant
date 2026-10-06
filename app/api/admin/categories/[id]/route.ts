import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validations/admin";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

// The slug never changes after creation, because products and URLs refer to it.
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  await connectDB();
  return (await Category.findByIdAndUpdate(id, parsed.data)) ? NextResponse.json({ ok: true }) : notFoundJson();
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  const c = await Category.findById(id);
  if (!c) return notFoundJson();
  if (await Product.exists({ category: c.slug })) return NextResponse.json({ error: "This category still has products. Move or delete them first." }, { status: 409 });
  await c.deleteOne();
  return NextResponse.json({ ok: true });
}
