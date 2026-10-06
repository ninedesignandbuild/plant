import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { ORDER_STATUSES } from "@/lib/config";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";

type Row = { _id: string; createdAt: string; total: number; paymentMethod: string; paymentStatus: string; orderStatus: string; shippingAddress?: { name?: string } };
export const metadata = { title: "Orders" };
export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = (ORDER_STATUSES as readonly string[]).includes(status ?? "") ? { orderStatus: status } : {};
  await connectDB();
  const orders: Row[] = JSON.parse(JSON.stringify(await Order.find(filter).sort({ createdAt: -1 }).limit(100).lean()));
  return (
    <>
      <h1 className="font-serif text-3xl text-forest">Orders</h1>
      <nav aria-label="Filter by status" className="my-4 flex flex-wrap gap-2 text-sm">
        {[["", "All"], ...ORDER_STATUSES.map((s) => [s, s.replace(/_/g, " ")])].map(([s, t]) => <Link key={s} href={s ? `/admin/orders?status=${s}` : "/admin/orders"} className={`rounded-full px-3 py-1 capitalize ${(status ?? "") === s ? "bg-forest text-white" : "bg-cream"}`}>{t}</Link>)}
      </nav>
      {orders.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="text-muted"><tr><th className="p-2">Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o._id} className="border-t border-sage/30"><td className="p-2"><Link href={`/admin/orders/${o._id}`} className="text-forest underline">#{o._id.slice(-8).toUpperCase()}</Link></td><td>{o.shippingAddress?.name}</td>
            <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td><td>{inr(o.total)}</td><td className="capitalize">{o.paymentMethod} · {o.paymentStatus}</td><td className="capitalize">{o.orderStatus.replace(/_/g, " ")}</td></tr>
        ))}</tbody>
      </table></div> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">No orders found.</p>}
    </>
  );
}
