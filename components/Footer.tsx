import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { getSettings } from "@/lib/settings";

const cols: [string, [string, string][]][] = [
  ["Quick Links", [["Home", "/"], ["Shop", "/shop"], ["About Us", "/about"], ["Contact Us", "/contact"], ["Services", "/services"]]],
  ["Shop Categories", [["Indoor Plants", "/shop/indoor-plants"], ["Outdoor Plants", "/shop/outdoor-plants"], ["Succulents", "/shop/succulents"], ["Pots & Planters", "/shop/planters"], ["Plant Care", "/shop/plant-care"]]],
  ["Customer Support", [["Shipping", "/shipping"], ["Returns", "/returns"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["FAQs", "/faqs"]]],
];

export default async function Footer() {
  const s = await getSettings();
  const social = [["Instagram", s.instagram], ["Facebook", s.facebook], ["YouTube", s.youtube], ["WhatsApp", s.whatsapp && `https://wa.me/${s.whatsapp}`]].filter(([, u]) => u);
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-3xl tracking-[0.25em]">NYNI</p>
          <p className="text-[10px] tracking-[0.55em]">NURSERY</p>
          <p className="mt-4 text-sm text-cream/80">Green Today. Healthier Tomorrow.</p>
          <p className="mt-6 text-sm">Get plant tips, new arrivals and exclusive offers.</p>
          <div className="mt-2"><NewsletterForm /></div>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm">{social.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-white">{n}</a></li>)}</ul>
        </div>
        {cols.map(([title, items]) => (
          <nav key={title} aria-label={title}>
            <h2 className="mb-3 font-medium">{title}</h2>
            <ul className="space-y-2 text-sm text-cream/80">
              {items.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-cream/70">© 2026 NYNI Nursery. All rights reserved.</p>
    </footer>
  );
}
