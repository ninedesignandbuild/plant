import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { decrementStock } from "@/lib/orders";
import { verifySignature } from "@/lib/razorpay";
import { Order } from "@/models/Order";
import { Coupon } from "@/models/Coupon";

const Body = z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment details." }, { status: 400 });
  const { razorpay_order_id: oid, razorpay_payment_id: pid, razorpay_signature: sig } = parsed.data;
  if (!verifySignature(oid, pid, sig)) return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });

  await connectDB();
  const order = await Order.findOne({ razorpayOrderId: oid, user: s.id });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.paymentStatus === "paid") return NextResponse.json({ orderId: String(order._id) });

  order.set({ paymentStatus: "paid", razorpayPaymentId: pid, razorpaySignature: sig });
  try { await decrementStock(order.items); order.orderStatus = "confirmed"; }
  catch {
    order.orderStatus = "cancelled"; // paid but sold out meanwhile: refund from the Razorpay dashboard
    await order.save();
    return NextResponse.json({ error: "An item sold out while you were paying. We'll refund you." }, { status: 409 });
  }
  await order.save();
  if (order.coupon) await Coupon.updateOne({ code: order.coupon }, { $inc: { usedCount: 1 } });
  return NextResponse.json({ orderId: String(order._id) });
}
