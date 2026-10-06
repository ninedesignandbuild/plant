import { notFound } from "next/navigation";
import OrderUpdateForm from "@/components/admin/OrderUpdateForm";
import { isId } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export const metadata = { title: "Order" };
export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isId(id)) notFound();
  await connectDB();
  const raw = await Order.findById(id).lean();
  if (!raw) notFound();
  const o = JSON.parse(JSON.stringify(raw));
  const u = await User.findById(o.user).select("name email phone").lean();
  const a = o.shippingAddress ?? {};
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-forest">Order #{id.slice(-8).toUpperCase()}</h1>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4"><h2 className="mb-1 font-medium">Customer</h2><p>{u?.name}</p><p>{u?.email}</p><p>{a.phone}</p></div>
        <div className="rounded-2xl bg-cream p-4"><h2 className="mb-1 font-medium">Deliver to ({o.deliveryMethod})</h2><p>{a.name}</p><p>{[a.line1, a.area, a.landmark].filter(Boolean).join(", ")}</p><p>{a.city}, {a.state} {a.pincode}</p></div>
      </div>
      <ul className="divide-y divide-sage/30 text-sm">{o.items.map((i: { name: string; quantity: number; price: number }) => <li key={i.name} className="flex justify-between py-2"><span>{i.name} × {i.quantity}</span><span>{inr(i.price * i.quantity)}</span></li>)}</ul>
      <dl className="ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(o.subtotal)}</dd></div>
        {o.discount > 0 && <div className="flex justify-between"><dt>Discount {o.coupon && `(${o.coupon})`}</dt><dd>−{inr(o.discount)}</dd></div>}
        <div className="flex justify-between"><dt>Delivery</dt><dd>{inr(o.deliveryFee)}</dd></div>
        <div className="flex justify-between font-medium"><dt>Total</dt><dd>{inr(o.total)}</dd></div>
      </dl>
      {o.razorpayPaymentId && <p className="text-sm text-muted">Razorpay payment {o.razorpayPaymentId}</p>}
      <OrderUpdateForm o={{ id, orderStatus: o.orderStatus, paymentStatus: o.paymentStatus, trackingNumber: o.trackingNumber, shippingProvider: o.shippingProvider }} />
    </div>
  );
}
