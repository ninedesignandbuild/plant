import Link from "next/link";
import { notFound } from "next/navigation";
import { isId } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

type O = { _id: string; createdAt: string; total: number; orderStatus: string };
export const metadata = { title: "Customer" };
export default async function Customer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isId(id)) notFound();
  await connectDB();
  const u = await User.findOne({ _id: id }).select("name email phone createdAt").lean(); // password hash is never selected
  if (!u) notFound();
  const orders: O[] = JSON.parse(JSON.stringify(await Order.find({ user: id }).sort({ createdAt: -1 }).limit(50).lean()));
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-forest">{u.name}</h1>
      <p className="text-sm text-muted">{u.email}{u.phone && ` · ${u.phone}`} · joined {new Date(u.createdAt).toLocaleDateString("en-IN")}</p>
      <h2 className="font-serif text-2xl text-forest">Orders</h2>
      {orders.length ? <ul className="divide-y divide-sage/30 text-sm">{orders.map((o) => (
        <li key={o._id} className="flex justify-between py-2"><Link href={`/admin/orders/${o._id}`} className="text-forest underline">#{o._id.slice(-8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</Link><span className="capitalize">{o.orderStatus.replace(/_/g, " ")} · {inr(o.total)}</span></li>
      ))}</ul> : <p className="text-muted">No orders yet.</p>}
    </div>
  );
}
