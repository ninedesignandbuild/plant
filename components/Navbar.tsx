import Link from "next/link";
import { Search, User, Heart, Menu } from "lucide-react";
import CartLink from "./CartLink";

const links = [["Home", "/"], ["Shop", "/shop"], ["Indoor Plants", "/shop/indoor-plants"], ["Outdoor Plants", "/shop/outdoor-plants"], ["Planters", "/shop/planters"], ["Services", "/services"], ["About Us", "/about"], ["Contact", "/contact"]];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" aria-label="NYNI Nursery home" className="leading-none text-forest">
          <span className="block font-serif text-2xl tracking-[0.25em]">NYNI</span>
          <span className="block text-[9px] tracking-[0.55em]">NURSERY</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-forest">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-4 text-forest">
          <Link href="/search" aria-label="Search"><Search size={20} /></Link>
          <Link href="/account" aria-label="Account"><User size={20} /></Link>
          <Link href="/wishlist" aria-label="Wishlist"><Heart size={20} /></Link>
          <CartLink />
          <details className="relative lg:hidden">
            <summary aria-label="Menu" className="cursor-pointer list-none"><Menu size={22} /></summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-3 w-56 rounded-2xl bg-white p-3 text-ink shadow-xl">
              {links.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 hover:bg-cream">{label}</Link>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
