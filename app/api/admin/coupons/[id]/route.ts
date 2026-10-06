import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { forbidden, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { Coupon } from "@/models/Coupon";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  const parsed = z.object({ isActive: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!isId(id) || !parsed.success) return notFoundJson();
  await connectDB();
  await Coupon.updateOne({ _id: id }, { isActive: parsed.data.isActive });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  await Coupon.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
