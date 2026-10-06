import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { inr } from "@/lib/utils";
import { btn } from "@/components/admin/ui";
import { Product } from "@/models/Product";

type Row = { _id: string; name: string; category: string; price: number; stock: number; isActive: boolean };
export const metadata = { title: "Products" };
export default async function AdminProducts() {
  await connectDB();
  const items: Row[] = JSON.parse(JSON.stringify(await Product.find().sort({ createdAt: -1 }).limit(200).lean()));
  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h1 className="font-serif text-3xl text-forest">Products</h1><Link href="/admin/products/new" className={btn}>Add product</Link></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="text-muted"><tr><th className="p-2">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
        <tbody>{items.map((p) => (
          <tr key={p._id} className="border-t border-sage/30"><td className="p-2"><Link href={`/admin/products/${p._id}`} className="text-forest underline">{p.name}</Link></td><td>{p.category}</td><td>{inr(p.price)}</td>
            <td className={p.stock <= 5 ? "text-terracotta" : ""}>{p.stock}</td><td>{p.isActive ? "Published" : "Hidden"}</td></tr>
        ))}</tbody>
      </table></div>
    </>
  );
}
