import Link from "next/link";
import type { ListQuery } from "@/lib/products";

const f = "w-full rounded-lg border border-sage/50 bg-white px-3 py-2 text-sm";
const L = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block space-y-1 text-sm"><span className="text-muted">{t}</span>{children}</label>;
const opts = (list: string[][]) => list.map(([k, t]) => <option key={k} value={k}>{t}</option>);

export default function FilterSidebar({ action, values: v, categories }: { action: string; values: ListQuery; categories: { name: string; slug: string }[] }) {
  return (
    <aside aria-label="Filters" className="self-start">
      <input id="filters-toggle" type="checkbox" className="peer sr-only" />
      <label htmlFor="filters-toggle" className="block cursor-pointer rounded-full border border-forest px-4 py-2 text-center text-sm text-forest lg:hidden">Filters &amp; sort</label>
      <form action={action} className="mt-3 hidden space-y-4 rounded-2xl bg-cream p-5 peer-checked:block lg:mt-0 lg:block">
        <L t="Search"><input name="q" defaultValue={v.q} className={f} /></L>
        {categories.length > 0 && <L t="Category"><select name="category" defaultValue={v.category ?? ""} className={f}><option value="">All</option>{opts(categories.map((c) => [c.slug, c.name]))}</select></L>}
        <L t="Sort by"><select name="sort" defaultValue={v.sort} className={f}>{opts([["newest", "Newest"], ["price-low", "Price: Low to High"], ["price-high", "Price: High to Low"], ["best", "Best Selling"], ["rated", "Top Rated"]])}</select></L>
        <L t="Light"><select name="light" defaultValue={v.light ?? ""} className={f}><option value="">Any</option>{opts([["Low", "Low light"], ["Bright", "Bright light"], ["Full sun", "Full sun"]])}</select></L>
        <L t="Care level"><select name="care" defaultValue={v.care ?? ""} className={f}><option value="">Any</option>{opts([["easy", "Easy"], ["medium", "Medium"], ["expert", "Expert"]])}</select></L>
        <div className="grid grid-cols-2 gap-2">
          <L t="Min ₹"><input name="minPrice" type="number" min={0} defaultValue={v.minPrice} className={f} /></L>
          <L t="Max ₹"><input name="maxPrice" type="number" min={0} defaultValue={v.maxPrice} className={f} /></L>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="inStock" value="1" defaultChecked={!!v.inStock} /> In stock only</label>
        <button className="w-full rounded-full bg-forest py-2.5 text-sm text-white">Apply</button>
        <Link href={action} className="block text-center text-sm text-muted underline">Clear</Link>
      </form>
    </aside>
  );
}
