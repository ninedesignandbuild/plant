import Link from "next/link";
import { SERVICES } from "@/lib/content";

export const metadata = { title: "Services", description: "Landscape design, garden setup, indoor plant styling, maintenance and bulk plant orders from NYNI Nursery.", alternates: { canonical: "/services" } };
export default function Services() {
  return (
    <>
      <section className="bg-cream px-4 py-14 text-center"><h1 className="font-serif text-5xl text-forest">Our Services</h1><p className="mt-2 text-muted">More than just plants — we create green spaces.</p></section>
      <ul className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.name} className="flex flex-col rounded-2xl border border-sage/30 p-6"><h2 className="font-serif text-2xl text-forest">{s.name}</h2><p className="mt-2 flex-1 text-sm text-muted">{s.blurb}</p>
            <Link href="/services/book" className="mt-4 text-sm text-forest underline">Request a quote</Link></li>
        ))}
      </ul>
      <div className="pb-14 text-center"><Link href="/services/book" className="rounded-full bg-terracotta px-7 py-3 text-sm text-white">Book a Consultation</Link></div>
    </>
  );
}
