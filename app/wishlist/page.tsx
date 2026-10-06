import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import ProductCard, { type CardProduct } from "@/components/ProductCard";

export const metadata = { title: "Wishlist" };
export default async function Wishlist() {
  const s = await getSession();
  await connectDB();
  const u = await User.findById(s?.id).select("wishlist").lean();
  const items: CardProduct[] = JSON.parse(JSON.stringify(await Product.find({ _id: { $in: u?.wishlist ?? [] }, isActive: true }).lean()));
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-serif text-4xl text-forest">Your wishlist</h1>
      {items.length ? <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        : <p className="mt-6 rounded-2xl bg-cream p-8 text-center text-muted">Nothing saved yet. <Link href="/shop" className="text-forest underline">Browse plants</Link></p>}
    </section>
  );
}
