import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";

type Recent = { _id: string; total: number; orderStatus: string; shippingAddress?: { name?: string } };
export default async function Dashboard() {
  await connectDB();
  const [orders, pending, customers, products, low, sums, recent] = await Promise.all([
    Order.countDocuments(), Order.countDocuments({ orderStatus: { $in: ["pending", "confirmed"] } }),
    User.countDocuments({ role: "customer" }), Product.countDocuments(), Product.countDocuments({ isActive: true, stock: { $lte: 5 } }),
    Order.aggregate([{ $match: { orderStatus: { $ne: "cancelled" } } }, { $group: { _id: "$paymentStatus", total: { $sum: "$total" } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const sales = sums.reduce((n: number, s: { total: number }) => n + s.total, 0);
  const revenue = sums.find((s: { _id: string }) => s._id === "paid")?.total ?? 0;
  const cards = [["Total sales", inr(sales)], ["Revenue (paid)", inr(revenue)], ["Total orders", orders], ["Pending orders", pending], ["Customers", customers], ["Products", products], ["Low stock (5 or fewer)", low]];
  return (
    <>
      <h1 className="font-serif text-3xl text-forest">Dashboard</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([k, v]) => <div key={k} className="rounded-2xl bg-cream p-4"><dt className="text-sm text-muted">{k}</dt><dd className="mt-1 font-serif text-2xl text-forest">{v}</dd></div>)}</dl>
      <h2 className="mb-2 mt-10 font-serif text-2xl text-forest">Recent orders</h2>
      <ul className="divide-y divide-sage/30 text-sm">{(JSON.parse(JSON.stringify(recent)) as Recent[]).map((o) => (
        <li key={o._id} className="flex justify-between py-2"><Link href={`/admin/orders/${o._id}`} className="text-forest underline">#{o._id.slice(-8).toUpperCase()} · {o.shippingAddress?.name}</Link><span className="capitalize">{o.orderStatus.replace(/_/g, " ")} · {inr(o.total)}</span></li>
      ))}</ul>
    </>
  );
}
