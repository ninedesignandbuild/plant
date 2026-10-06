import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { invalid, isDup } from "@/lib/admin";
import { rateLimit } from "@/lib/rateLimit";
import { eligibleOrder, refreshRating } from "@/lib/reviews";
import { Review } from "@/models/Review";

const Body = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i), rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(), comment: z.string().trim().min(5).max(1500),
});

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please sign in to write a review." }, { status: 401 });
  if (!rateLimit(`review:${s.id}`, 5)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  await connectDB();
  const order = await eligibleOrder(s.id, d.productId);
  if (!order) return NextResponse.json({ error: "You can review a product after it has been delivered to you." }, { status: 403 });
  try { await Review.create({ product: d.productId, user: s.id, order: order._id, userName: s.name, rating: d.rating, title: d.title, comment: d.comment }); }
  catch (e) { if (isDup(e)) return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 }); throw e; }
  await refreshRating(d.productId);
  return NextResponse.json({ ok: true });
}
