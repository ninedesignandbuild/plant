import { NextRequest, NextResponse } from "next/server";
import { cartSchema } from "@/lib/validations/order";
import { CartError, priceCart } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";

export async function POST(req: NextRequest) {
  const parsed = cartSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  try {
    const { items, ...totals } = await priceCart(parsed.data.items, parsed.data.coupon, parsed.data.deliveryMethod);
    void items;
    return NextResponse.json({ ...totals, codEnabled: (await getSettings()).codEnabled });
  } catch (e) {
    if (e instanceof CartError) return NextResponse.json({ error: e.message }, { status: 409 });
    throw e;
  }
}
