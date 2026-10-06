import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "My account" };
export default async function Account() {
  const s = await getSession();
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl text-forest">Hello, {s?.name}</h1>
      <p className="mt-2 text-muted">Your orders, addresses and wishlist will appear here.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/account/orders" className="rounded-full bg-forest px-5 py-2 text-sm text-white">My orders</Link><Link href="/wishlist" className="rounded-full border border-forest px-5 py-2 text-sm text-forest">Wishlist</Link><LogoutButton /></div>
    </section>
  );
}
