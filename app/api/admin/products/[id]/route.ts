import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations/admin";
import { Product } from "@/models/Product";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  await connectDB();
  try { if (!(await Product.findByIdAndUpdate(id, { ...parsed.data, sku: parsed.data.sku || undefined }))) return notFoundJson(); }
  catch (e) { if (isDup(e)) return NextResponse.json({ error: "That SKU is already used." }, { status: 409 }); throw e; }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  return (await Product.findByIdAndDelete(id)) ? NextResponse.json({ ok: true }) : notFoundJson();
}
