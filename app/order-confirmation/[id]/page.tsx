import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { Order } from "@/models/Order";
import { inr } from "@/lib/utils";

export const metadata = { title: "Order confirmed" };
export default async function Confirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getSession();
  if (!s || !/^[a-f\d]{24}$/i.test(id)) notFound();
  await connectDB();
  const o = await Order.findOne({ _id: id, user: s.id }).lean();
  if (!o) notFound();
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-5xl text-forest">{o.orderStatus === "cancelled" ? "Order cancelled" : "Thank you for your order"}</h1>
      <p className="mt-2 text-muted">Order #{String(o._id).slice(-8).toUpperCase()} · {o.paymentMethod === "cod" ? "Cash on delivery" : `Payment ${o.paymentStatus}`}</p>
      <ul className="mt-6 divide-y divide-sage/30">{o.items.map((i: { name: string; quantity: number; price: number }) => <li key={i.name} className="flex justify-between py-3 text-sm"><span>{i.name} × {i.quantity}</span><span>{inr(i.price * i.quantity)}</span></li>)}</ul>
      <p className="mt-4 flex justify-between font-medium"><span>Total</span><span>{inr(o.total)}</span></p>
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-forest px-6 py-3 text-sm text-white">Continue shopping</Link>
    </section>
  );
}
