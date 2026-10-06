import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { CartError, priceCart } from "@/lib/pricing";
import { decrementStock } from "@/lib/orders";
import { createRazorpayOrder } from "@/lib/razorpay";
import { orderSchema } from "@/lib/validations/order";
import { Order } from "@/models/Order";
import { Coupon } from "@/models/Coupon";

const payload = (o: { _id: unknown; razorpayOrderId?: string; total: number }) => ({ orderId: String(o._id), razorpayOrderId: o.razorpayOrderId, amount: Math.round(o.total * 100), keyId: process.env.RAZORPAY_KEY_ID });

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  if (!rateLimit(`order:${s.id}`, 10)) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: `Check ${parsed.error.issues[0].path.join(".")} and try again.` }, { status: 400 });
  const d = parsed.data;
  await connectDB();

  // Same key = same order, so a double click or retry never creates a duplicate.
  const dup = await Order.findOne({ user: s.id, idempotencyKey: d.idempotencyKey }).lean();
  if (dup) return NextResponse.json(payload(dup));

  let priced;
  try { priced = await priceCart(d.items, d.coupon, d.deliveryMethod); }
  catch (e) { if (e instanceof CartError) return NextResponse.json({ error: e.message }, { status: 409 }); throw e; }
  if (priced.couponError) return NextResponse.json({ error: priced.couponError }, { status: 400 });
  const { items, subtotal, discount, deliveryFee, total, coupon } = priced;

  if (d.paymentMethod === "cod" && !(await getSettings()).codEnabled) return NextResponse.json({ error: "Cash on delivery is not available right now." }, { status: 400 });
  const order = await Order.create({ user: s.id, items, shippingAddress: d.address, subtotal, discount, deliveryFee, total, coupon, deliveryMethod: d.deliveryMethod, paymentMethod: d.paymentMethod, idempotencyKey: d.idempotencyKey });
  if (d.paymentMethod === "cod") {
    try { await decrementStock(items); }
    catch { await order.deleteOne(); return NextResponse.json({ error: "Some items just sold out. Please review your cart." }, { status: 409 }); }
    order.orderStatus = "confirmed";
    await order.save();
    if (coupon) await Coupon.updateOne({ code: coupon }, { $inc: { usedCount: 1 } });
  } else {
    try { order.razorpayOrderId = (await createRazorpayOrder(total, String(order._id))).id; await order.save(); }
    catch { await order.deleteOne(); return NextResponse.json({ error: "Online payment is unavailable right now. Try cash on delivery." }, { status: 502 }); }
  }
  return NextResponse.json(payload(order));
}
