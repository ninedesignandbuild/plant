import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";
import { Category } from "@/models/Category";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  await connectDB();
  try { await Category.create({ ...parsed.data, slug: slugify(parsed.data.name) }); }
  catch (e) { if (isDup(e)) return NextResponse.json({ error: "A category with that name already exists." }, { status: 409 }); throw e; }
  return NextResponse.json({ ok: true });
}
