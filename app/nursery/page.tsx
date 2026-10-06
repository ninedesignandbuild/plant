import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSettings } from "@/lib/settings";
import { Category } from "@/models/Category";

export const metadata = { title: "Visit our nursery", description: "See our plants in person and get expert advice at NYNI Nursery.", alternates: { canonical: "/nursery" } };
export default async function Nursery() {
  let cats: { name: string; slug: string }[] = [];
  try { await connectDB(); cats = JSON.parse(JSON.stringify(await Category.find({ isActive: true }).sort({ order: 1 }).select("name slug").lean())); } catch { /* show the page without categories */ }
  const s = await getSettings();
  const wa = s.whatsapp;
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`;
  const info = [["Address", s.address], ["Opening hours", s.openingHours], ["Phone", s.phone]].filter(([, v]) => v);
  return (
    <>
      <section className="bg-cream px-4 py-14 text-center"><h1 className="font-serif text-5xl text-forest">Visit Our Nursery</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted">See our plants in person, get expert advice and find the perfect green addition for your space.</p></section>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div>
          <dl className="space-y-3 text-sm">{info.map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={dir} target="_blank" rel="noopener noreferrer" className="rounded-full bg-forest px-6 py-3 text-sm text-white">Get Directions</a>
            {wa && <a href={`https://wa.me/${wa}`} className="rounded-full border border-forest px-6 py-3 text-sm text-forest hover:bg-forest hover:text-white">WhatsApp us</a>}
          </div>
          <h2 className="mt-10 font-serif text-2xl text-forest">What you'll find</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{cats.map((c) => <li key={c.slug}><Link href={`/shop/${c.slug}`} className="rounded-full bg-cream px-4 py-2 text-sm">{c.name}</Link></li>)}</ul>
          <h2 className="mt-10 font-serif text-2xl text-forest">Before you visit</h2>
          <p className="mt-2 text-sm leading-relaxed">Bring photos of your space and tell us how much light it gets. Our team can suggest plants and planters that suit it.</p>
        </div>
        {s.mapsEmbedUrl ? <iframe title="NYNI Nursery on Google Maps" src={s.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-96 w-full rounded-3xl border-0" /> : <div className="grid h-96 place-items-center rounded-3xl bg-sage/30 text-sm text-muted">Use “Get Directions” to find us on Google Maps.</div>}
      </div>
    </>
  );
}
