import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { isId, notFoundJson } from "@/lib/admin";
import { CANCELLABLE } from "@/lib/config";
import { restoreStock } from "@/lib/orders";
import { Order } from "@/models/Order";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { id } = await params;
  if (!isId(id)) return notFoundJson();
  await connectDB();
  // Atomic: only one request can move the order to cancelled, so stock is restored once.
  const o = await Order.findOneAndUpdate({ _id: id, user: s.id, orderStatus: { $in: CANCELLABLE } }, { orderStatus: "cancelled" });
  if (!o) return NextResponse.json({ error: "This order can't be cancelled now. Please contact support." }, { status: 400 });
  if (o.orderStatus !== "pending") await restoreStock(o.items); // pending orders never took stock
  return NextResponse.json({ ok: true });
}
