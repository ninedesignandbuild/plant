import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { forbidden, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { refreshRating } from "@/lib/reviews";
import { Review } from "@/models/Review";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  const parsed = z.object({ isHidden: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!isId(id) || !parsed.success) return notFoundJson();
  await connectDB();
  const r = await Review.findByIdAndUpdate(id, { isHidden: parsed.data.isHidden });
  if (!r) return notFoundJson();
  await refreshRating(r.product);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  const r = await Review.findByIdAndDelete(id);
  if (!r) return notFoundJson();
  await refreshRating(r.product);
  return NextResponse.json({ ok: true });
}
