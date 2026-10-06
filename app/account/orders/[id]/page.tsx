import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import CancelOrderButton from "@/components/CancelOrderButton";
import OrderTimeline from "@/components/OrderTimeline";
import { isId } from "@/lib/admin";
import { getSession } from "@/lib/auth";
import { CANCELLABLE } from "@/lib/config";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/lib/settings";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";

export const metadata = { title: "Order details" };
export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getSession();
  if (!s) redirect("/login");
  if (!isId(id)) notFound();
  await connectDB();
  const raw = await Order.findOne({ _id: id, user: s.id }).lean();
  if (!raw) notFound();
  const o = JSON.parse(JSON.stringify(raw));
  const a = o.shippingAddress ?? {};
  const wa = (await getSettings()).whatsapp;
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="font-serif text-4xl text-forest">Order #{id.slice(-8).toUpperCase()}</h1>
      <OrderTimeline status={o.orderStatus} />
      <ul className="divide-y divide-sage/30 text-sm">{o.items.map((i: { name: string; quantity: number; price: number }) => <li key={i.name} className="flex justify-between py-2"><span>{i.name} × {i.quantity}</span><span>{inr(i.price * i.quantity)}</span></li>)}</ul>
      <dl className="ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(o.subtotal)}</dd></div>
        {o.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{inr(o.discount)}</dd></div>}
        <div className="flex justify-between"><dt>Delivery</dt><dd>{inr(o.deliveryFee)}</dd></div>
        <div className="flex justify-between font-medium"><dt>Total</dt><dd>{inr(o.total)}</dd></div>
      </dl>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4"><h2 className="font-medium">Delivery</h2><p className="capitalize">{o.deliveryMethod}</p><p>{a.name}</p><p>{[a.line1, a.area, a.landmark].filter(Boolean).join(", ")}</p><p>{a.city}, {a.state} {a.pincode}</p>
          {o.trackingNumber && <p className="mt-2">Tracking: {o.shippingProvider} {o.trackingNumber}</p>}</div>
        <div className="rounded-2xl bg-cream p-4"><h2 className="font-medium">Payment</h2><p>{o.paymentMethod === "cod" ? "Cash on delivery" : "Online (Razorpay)"}</p><p className="capitalize">{o.paymentStatus}</p></div>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        {CANCELLABLE.includes(o.orderStatus) && <CancelOrderButton id={id} />}
        <a href={wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`Hi NYNI Nursery, I need help with order #${id.slice(-8).toUpperCase()}.`)}` : "/contact"} className="rounded-full border border-forest px-5 py-2 text-sm text-forest">Contact support</a>
        <Link href="/account/orders" className="px-2 py-2 text-sm text-muted underline">All orders</Link>
      </div>
      {o.paymentMethod === "razorpay" && o.paymentStatus === "paid" && <p className="text-xs text-muted">If you cancel a paid order, our team will process your refund.</p>}
    </section>
  );
}
