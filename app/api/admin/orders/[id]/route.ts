import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { forbidden, invalid, isId, notFoundJson, requireAdmin } from "@/lib/admin";
import { orderUpdateSchema } from "@/lib/validations/admin";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  const parsed = orderUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  await connectDB();
  const o = await Order.findById(id);
  if (!o) return notFoundJson();
  const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
  if (o.orderStatus === "cancelled" && d.orderStatus && d.orderStatus !== "cancelled") return bad("Cancelled orders can't be reopened.");
  if (o.orderStatus === "pending" && d.orderStatus && !["pending", "cancelled"].includes(d.orderStatus)) return bad("Unpaid online orders can only be cancelled until payment is verified.");
  // Stock is only taken once an order is confirmed, so only those orders give it back.
  if (d.orderStatus === "cancelled" && !["pending", "cancelled"].includes(o.orderStatus))
    await Product.bulkWrite(o.items.map((i: { product: unknown; quantity: number }) => ({ updateOne: { filter: { _id: i.product }, update: { $inc: { stock: i.quantity } } } })));
  o.set(d);
  if (d.orderStatus === "delivered" && o.paymentMethod === "cod") o.paymentStatus = "paid";
  await o.save();
  return NextResponse.json({ ok: true });
}
