import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { listProducts, parseListQuery } from "@/lib/products";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";

type Raw = Record<string, string | string[] | undefined>;
const pill = "rounded-full border border-forest px-4 py-2 text-forest hover:bg-forest hover:text-white";

export default async function ShopView({ title, description, action, raw, category }: { title: string; description?: string; action: string; raw: Raw; category?: string }) {
  const q = parseListQuery(category ? { ...raw, category } : raw);
  const { items, total, page, pages } = await listProducts(q);
  let cats: { name: string; slug: string }[] = [];
  if (!category) { await connectDB(); cats = JSON.parse(JSON.stringify(await Category.find({ isActive: true }).sort({ order: 1 }).select("name slug").lean())); }
  const href = (n: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(raw)) if (typeof v === "string" && k !== "page") sp.set(k, v);
    sp.set("page", String(n));
    return `${action}?${sp}`;
  };

  return (
    <>
      <section className="bg-cream px-4 py-12 text-center">
        <h1 className="font-serif text-5xl text-forest">{title}</h1>
        {description && <p className="mx-auto mt-2 max-w-xl text-muted">{description}</p>}
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <FilterSidebar action={action} values={q} categories={cats} />
        <div>
          <p className="mb-4 text-sm text-muted" aria-live="polite">{total} {total === 1 ? "product" : "products"}</p>
          {items.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
          ) : (
            <div className="rounded-2xl bg-cream p-10 text-center">
              <p className="font-serif text-2xl text-forest">No products found</p>
              <p className="mt-1 text-muted">Try removing a filter or searching for something else.</p>
              <Link href={action} className="mt-4 inline-block text-forest underline">Clear filters</Link>
            </div>
          )}
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4 text-sm">
              {page > 1 && <Link href={href(page - 1)} className={pill}>Previous</Link>}
              <span>Page {page} of {pages}</span>
              {page < pages && <Link href={href(page + 1)} className={pill}>Next</Link>}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
