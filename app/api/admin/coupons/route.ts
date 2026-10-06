import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isDup, requireAdmin } from "@/lib/admin";
import { couponSchema } from "@/lib/validations/admin";
import { Coupon } from "@/models/Coupon";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = couponSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const { expiresAt, ...d } = parsed.data;
  await connectDB();
  try { await Coupon.create({ ...d, expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59`) : undefined }); }
  catch (e) { if (isDup(e)) return NextResponse.json({ error: "That code already exists." }, { status: 409 }); throw e; }
  return NextResponse.json({ ok: true });
}
