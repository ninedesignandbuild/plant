import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { searchAll } from "@/lib/search";

export const metadata = { title: "Search", robots: { index: false } };
export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = ((Array.isArray(raw) ? raw[0] : raw) ?? "").slice(0, 60);
  const r = await searchAll(q, 24);
  const none = !r.products.length && !r.categories.length && !r.posts.length;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-forest">Search</h1>
      <div className="mt-4 max-w-xl"><SearchBar initial={q} /></div>
      {q.trim().length >= 2 && none && <p className="mt-8 rounded-2xl bg-cream p-8 text-center text-muted">No results for “{q}”. Try another name or <Link href="/shop" className="text-forest underline">browse the shop</Link>.</p>}
      {r.categories.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{r.categories.map((c) => <Link key={c.slug} href={`/shop/${c.slug}`} className="rounded-full bg-cream px-4 py-2 text-sm text-forest">{c.name}</Link>)}</div>}
      {r.products.length > 0 && <><h2 className="mb-4 mt-8 font-serif text-2xl text-forest">Products</h2><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{r.products.map((p) => <ProductCard key={p._id} p={p} />)}</div></>}
      {r.posts.length > 0 && <><h2 className="mb-4 mt-10 font-serif text-2xl text-forest">Care articles</h2><div className="grid gap-4 sm:grid-cols-3">{r.posts.map((p) => <BlogCard key={p.slug} p={p} />)}</div></>}
    </section>
  );
}
