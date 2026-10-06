import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Leaf, MessageCircle } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import { eligibleOrder } from "@/lib/reviews";
import { Review } from "@/models/Review";
import Stars from "@/components/Stars";
import ReviewForm from "@/components/ReviewForm";
import { Product } from "@/models/Product";
import { inr, discountPct } from "@/lib/utils";
import ProductCard, { type CardProduct } from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";

type Props = { params: Promise<{ slug: string }> };
type Rev = { _id: string; rating: number; title?: string; comment: string; userName: string; createdAt: string };
const getProduct = cache(async (slug: string) => {
  await connectDB();
  const d = await Product.findOne({ slug, isActive: true }).lean();
  return d ? JSON.parse(JSON.stringify(d)) : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.shortDescription, alternates: { canonical: `/products/${p.slug}` }, openGraph: { title: p.name, description: p.shortDescription, images: p.images?.[0] ? [p.images[0]] : undefined } };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const off = discountPct(p.price, p.compareAtPrice);
  const related = JSON.parse(JSON.stringify(await Product.find({ category: p.category, isActive: true, _id: { $ne: p._id } }).limit(4).lean()));
  const wa = (await getSettings()).whatsapp;
  const reviews: Rev[] = JSON.parse(JSON.stringify(await Review.find({ product: p._id, isHidden: false }).sort({ createdAt: -1 }).limit(20).lean()));
  const session = await getSession();
  const canReview = !!session && !(await Review.exists({ product: p._id, user: session.id })) && !!(await eligibleOrder(session.id, p._id));
  const facts = [["Light", p.lightRequirement], ["Water", p.waterRequirement], ["Care level", p.careLevel], ["Pet friendly", p.petFriendly ? "Yes" : "No"], ["Height", p.height], ["Pot size", p.potSize]].filter(([, v]) => v);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.shortDescription, sku: p.sku, image: p.images, ...(p.reviewCount > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: p.ratings, reviewCount: p.reviewCount } }), offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: `https://schema.org/${p.stock > 0 ? "InStock" : "OutOfStock"}` } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-cream">
          {p.images?.[0] ? <Image src={p.images[0]} alt={p.name} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /> : <Leaf size={48} className="text-sage/60" aria-hidden />}
        </div>
        <div>
          <h1 className="font-serif text-5xl text-forest">{p.name}</h1>
          {p.reviewCount > 0 && <p className="mt-2 text-sm"><Stars value={p.ratings} /> <span className="text-muted">{p.ratings} · {p.reviewCount} {p.reviewCount === 1 ? "review" : "reviews"}</span></p>}
          <p className="mt-4 flex items-baseline gap-3"><span className="text-3xl font-medium">{inr(p.price)}</span>
            {off > 0 && <><span className="text-muted line-through">{inr(p.compareAtPrice)}</span><span className="rounded-full bg-terracotta px-2 py-0.5 text-xs text-white">{off}% off</span></>}</p>
          <p className={`mt-1 text-sm ${p.stock > 0 ? "text-forest" : "text-terracotta"}`}>{p.stock > 0 ? (p.stock < 5 ? `Only ${p.stock} left` : "In stock") : "Out of stock"}</p>
          <p className="mt-4 text-muted">{p.shortDescription}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-cream p-5 text-sm">
            {facts.map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="font-medium capitalize">{v}</dd></div>)}
          </dl>
          <AddToCart line={{ productId: p._id, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] }} stock={p.stock} />
          <div className="mt-3"><WishlistButton productId={p._id} /></div>
          {wa && <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi NYNI Nursery, I'd like to ask about the ${p.name}.`)}`} className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest px-5 py-2.5 text-sm text-forest hover:bg-forest hover:text-white"><MessageCircle size={16} /> Ask on WhatsApp</a>}
          {p.description && <p className="mt-8 leading-relaxed">{p.description}</p>}
        </div>
      </div>
      <section aria-labelledby="reviews" className="mt-16 max-w-2xl">
        <h2 id="reviews" className="mb-5 font-serif text-3xl text-forest">Reviews</h2>
        {canReview && <ReviewForm productId={p._id} />}
        {reviews.length ? <ul className="mt-4 divide-y divide-sage/30">{reviews.map((r) => (
          <li key={r._id} className="py-4 text-sm"><Stars value={r.rating} /> <span className="font-medium">{r.title}</span><p className="mt-1">{r.comment}</p>
            <p className="mt-1 text-xs text-muted">{r.userName} · Verified purchase · {new Date(r.createdAt).toLocaleDateString("en-IN")}</p></li>
        ))}</ul> : <p className="text-muted">No reviews yet.</p>}
      </section>
      {related.length > 0 && (
        <section aria-labelledby="rel" className="mt-16">
          <h2 id="rel" className="mb-5 font-serif text-3xl text-forest">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((r: CardProduct) => <ProductCard key={r._id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
