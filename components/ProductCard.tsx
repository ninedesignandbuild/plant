import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { inr, discountPct } from "@/lib/utils";

export type CardProduct = { _id: string; name: string; slug: string; shortDescription?: string; price: number; compareAtPrice?: number; stock: number; images?: string[] };

export default function ProductCard({ p }: { p: CardProduct }) {
  const off = discountPct(p.price, p.compareAtPrice);
  return (
    <article className="group rounded-2xl border border-sage/30 bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream">
          {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />}
          {off > 0 && <span className="absolute left-2 top-2 rounded-full bg-terracotta px-2 py-0.5 text-xs text-white">{off}% off</span>}
        </div>
        <h3 className="mt-3 text-sm font-medium">{p.name}</h3>
        <p className="line-clamp-1 text-xs text-muted">{p.shortDescription}</p>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <span className="font-medium">{inr(p.price)}</span>
          {off > 0 && <span className="ml-2 text-xs text-muted line-through">{inr(p.compareAtPrice!)}</span>}
          <p className={`text-xs ${p.stock > 0 ? "text-forest" : "text-terracotta"}`}>{p.stock > 0 ? "In stock" : "Out of stock"}</p>
        </div>
        <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`} className="grid h-9 w-9 place-items-center rounded-full bg-forest text-white hover:bg-forest/90"><ShoppingBag size={16} /></Link>
      </div>
    </article>
  );
}
