import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { inr } from "@/lib/utils";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

type U = { _id: string; name: string; email: string; phone?: string; createdAt: string };
type Stat = { _id: string; orders: number; spent: number };
export const metadata = { title: "Customers" };
export default async function Customers() {
  await connectDB();
  const [users, sums] = await Promise.all([
    User.find({ role: "customer" }).sort({ createdAt: -1 }).limit(200).select("name email phone createdAt").lean(),
    Order.aggregate([{ $match: { orderStatus: { $ne: "cancelled" } } }, { $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: "$total" } } }]),
  ]);
  const stats = new Map<string, Stat>((sums as { _id: unknown; orders: number; spent: number }[]).map((s) => [String(s._id), { ...s, _id: String(s._id) }]));
  return (
    <>
      <h1 className="mb-4 font-serif text-3xl text-forest">Customers</h1>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="text-muted"><tr><th className="p-2">Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Joined</th></tr></thead>
        <tbody>{(JSON.parse(JSON.stringify(users)) as U[]).map((u) => (
          <tr key={u._id} className="border-t border-sage/30"><td className="p-2"><Link href={`/admin/customers/${u._id}`} className="text-forest underline">{u.name}</Link></td><td>{u.email}</td><td>{u.phone ?? "—"}</td>
            <td>{stats.get(u._id)?.orders ?? 0}</td><td>{inr(stats.get(u._id)?.spent ?? 0)}</td><td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td></tr>
        ))}</tbody>
      </table></div>
    </>
  );
}
