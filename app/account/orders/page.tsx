import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";

type Row = { _id: string; createdAt: string; total: number; paymentStatus: string; orderStatus: string; items: { name: string; quantity: number }[] };
export const metadata = { title: "My orders" };
export default async function Orders() {
  const s = await getSession();
  if (!s) redirect("/login?next=/account/orders");
  await connectDB();
  const orders: Row[] = JSON.parse(JSON.stringify(await Order.find({ user: s.id }).sort({ createdAt: -1 }).limit(50).lean()));
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-forest">My orders</h1>
      {orders.length ? (
        <ul className="mt-6 space-y-3">{orders.map((o) => (
          <li key={o._id}><Link href={`/account/orders/${o._id}`} className="block rounded-2xl border border-sage/30 p-4 hover:shadow-md">
            <div className="flex justify-between text-sm"><span className="font-medium">#{o._id.slice(-8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</span><span>{inr(o.total)}</span></div>
            <p className="mt-1 text-sm text-muted">{o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}</p>
            <p className="mt-1 text-sm capitalize text-forest">{o.orderStatus.replace(/_/g, " ")} · payment {o.paymentStatus}</p>
          </Link></li>
        ))}</ul>
      ) : <p className="mt-6 rounded-2xl bg-cream p-8 text-center text-muted">No orders yet. <Link href="/shop" className="text-forest underline">Browse plants</Link></p>}
    </section>
  );
}
