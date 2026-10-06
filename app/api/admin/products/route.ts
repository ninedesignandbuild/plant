import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";
import { Product } from "@/models/Product";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  await connectDB();
  let slug = slugify(d.name);
  if (await Product.exists({ slug })) slug += `-${Date.now().toString(36).slice(-4)}`;
  try { const p = await Product.create({ ...d, sku: d.sku || undefined, slug }); return NextResponse.json({ id: String(p._id) }); }
  catch (e) { if (isDup(e)) return NextResponse.json({ error: "That SKU is already used." }, { status: 409 }); throw e; }
}
