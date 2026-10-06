import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { ArrowRight, Leaf, Truck, ShieldCheck, Sprout, Headset } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductCard, { type CardProduct } from "@/components/ProductCard";
import BlogCard, { type Post } from "@/components/BlogCard";
import { BlogPost } from "@/models/BlogPost";

const cats = [["Indoor Plants", "indoor-plants"], ["Outdoor Plants", "outdoor-plants"], ["Succulents", "succulents"], ["Flowering Plants", "flowering-plants"], ["Pots & Planters", "planters"], ["Plant Care Products", "plant-care"]];
const perks = [[Leaf, "Premium Quality Plants", "Healthy and well-cared for"], [Truck, "Safe & Fast Delivery", "Across Hyderabad & nearby areas"], [ShieldCheck, "Secure Payments", "UPI, Cards, Net Banking"], [Sprout, "Expert Guidance", "Plant care and maintenance tips"], [Headset, "Personalised Support", "We're here to help"]] as const;
const services = ["Landscape Design & Installation", "Indoor Plant Styling", "Garden Maintenance", "Corporate & Event Greenery", "Bulk Plant Orders"];
const bg = (src: string) => ({ backgroundImage: `url(${src})` });
const btn = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition";

async function bestSellers(): Promise<CardProduct[]> {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await Product.find({ isActive: true, isBestSeller: true }).sort({ createdAt: -1 }).limit(5).lean()));
  } catch { return []; }
}

async function latestPosts(): Promise<Post[]> {
  try { await connectDB(); return JSON.parse(JSON.stringify(await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean())); } catch { return []; }
}

export default async function Home() {
  const products = await bestSellers();
  const posts = await latestPosts();
  const s = await getSettings();
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <h1 className="font-serif text-6xl leading-[0.95] text-forest sm:text-7xl">Bring Nature <span className="block font-script text-7xl sm:text-8xl">Home</span></h1>
            <p className="mt-5 text-sm font-medium text-forest">Fresh Plants &nbsp;|&nbsp; Beautiful Planters &nbsp;|&nbsp; Greener Spaces</p>
            <p className="mt-3 max-w-md text-muted">Fresh plants, beautiful planters and expert guidance for a greener, happier home.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className={`${btn} bg-forest text-white hover:bg-forest/90`}>Shop Plants <ArrowRight size={16} /></Link>
              <Link href="/services" className={`${btn} border border-forest text-forest hover:bg-forest hover:text-white`}>Our Services</Link>
            </div>
          </div>
          <div role="img" aria-label="Indoor plants in a bright modern home" style={bg("/images/hero.jpg")} className="min-h-[320px] rounded-3xl bg-sage/40 bg-cover bg-center lg:min-h-[460px]" />
        </div>
      </section>

      <section aria-labelledby="cats" className="mx-auto max-w-7xl px-4 py-14">
        <h2 id="cats" className="sr-only">Shop by category</h2>
        <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {cats.map(([name, slug]) => (
            <li key={slug}><Link href={`/shop/${slug}`} className="group flex flex-col items-center gap-3 text-center text-sm">
              <span style={bg(`/images/categories/${slug}.jpg`)} className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-cream bg-cover bg-center shadow-sm transition group-hover:scale-105 group-hover:shadow-lg"><Leaf className="text-sage/60" /></span>
              <span className="inline-flex items-center gap-1">{name} <ArrowRight size={14} /></span>
            </Link></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="best" className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="best" className="font-serif text-4xl text-forest">Best Sellers</h2><p className="text-muted">Loved by plant parents</p></div>
          <Link href="/shop" className={`${btn} border border-forest py-2 text-forest hover:bg-forest hover:text-white`}>View All Products <ArrowRight size={16} /></Link>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{products.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        ) : (
          <p className="rounded-2xl bg-cream p-8 text-center text-muted">No products yet. Set MONGODB_URI and run <code>npm run seed</code>.</p>
        )}
        <div style={bg("/images/nursery.jpg")} className="mt-6 flex min-h-48 items-center rounded-3xl bg-forest bg-cover bg-center p-8 text-cream">
          <div><p className="font-serif text-4xl leading-tight">Fresh Plants<br />Direct From Our Nursery</p>
            <Link href="/nursery" className={`${btn} mt-4 border border-cream hover:bg-cream hover:text-forest`}>Explore Nursery <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="bg-cream"><ul className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">
        {perks.map(([Icon, t, d]) => (
          <li key={t} className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-forest text-forest"><Icon size={22} /></span>
            <span><span className="block text-sm font-medium text-forest">{t}</span><span className="text-xs text-muted">{d}</span></span></li>
        ))}
      </ul></section>

      <section className="grid lg:grid-cols-2">
        <div role="img" aria-label="Interior styled with indoor plants" style={bg("/images/services.jpg")} className="min-h-72 bg-sage/40 bg-cover bg-center" />
        <div className="bg-forest p-10 text-cream lg:p-14">
          <h2 className="font-serif text-4xl">Our Services</h2>
          <p className="mt-2 text-cream/80">More than just plants — we create green spaces.</p>
          <ul className="my-6 space-y-3">{services.map((s) => <li key={s} className="border-b border-white/15 pb-3">{s}</li>)}</ul>
          <Link href="/services/book" className={`${btn} bg-terracotta text-white hover:bg-terracotta/90`}>Book a Consultation <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="bg-cream px-4 py-16 text-center">
        <h2 className="font-serif text-4xl text-forest">Plant Care Tips</h2>
        <p className="mt-2 text-muted">Simple tips for healthier, happier plants.</p>
        {posts.length > 0 && <div className="mx-auto mt-8 grid max-w-6xl gap-4 text-left sm:grid-cols-3">{posts.map((p) => <BlogCard key={p.slug} p={p} />)}</div>}
        <Link href="/blog" className={`${btn} mt-6 border border-forest text-forest hover:bg-forest hover:text-white`}>Read Our Blog <ArrowRight size={16} /></Link>
      </section>
      <section className="bg-forest px-4 py-16 text-center text-cream">
        <h2 className="font-serif text-4xl">Visit Our Nursery</h2>
        <p className="mx-auto mt-2 max-w-xl text-cream/80">See our plants in person, get expert advice and find the perfect green addition for your space.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-terracotta text-white hover:bg-terracotta/90`}>Get Directions</a>
          <Link href="/contact" className={`${btn} border border-cream hover:bg-cream hover:text-forest`}>Contact Us</Link>
        </div>
        <p className="mt-6 text-sm text-cream/80">{[s.address, s.openingHours, s.phone].filter(Boolean).join(" · ")}</p>
      </section>
    </>
  );
}
