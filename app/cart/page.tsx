"use client";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useQuote } from "@/components/useQuote";
import CouponBox from "@/components/CouponBox";
import { inr } from "@/lib/utils";

const step = "h-8 w-8 rounded-full border border-sage/60";

export default function CartPage() {
  const { lines, setQty, remove, coupon } = useCart();
  const q = useQuote(coupon);
  if (!lines.length) return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-4xl text-forest">Your cart is empty</h1>
      <p className="mt-2 text-muted">Find a plant you love and add it here.</p>
      <Link href="/shop" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-sm text-white">Continue shopping</Link>
    </section>
  );
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-serif text-4xl text-forest">Your cart</h1>
        <ul className="mt-6 divide-y divide-sage/30">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-4 py-4">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-cream">
                {l.image ? <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" /> : <Leaf className="text-sage/60" aria-hidden />}
              </div>
              <div className="flex-1">
                <Link href={`/products/${l.slug}`} className="font-medium">{l.name}</Link>
                <p className="text-sm text-muted">{inr(l.price)}</p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <button aria-label={`Decrease ${l.name}`} onClick={() => setQty(l.productId, l.quantity - 1)} className={step}>−</button>
                  <span aria-live="polite">{l.quantity}</span>
                  <button aria-label={`Increase ${l.name}`} onClick={() => setQty(l.productId, l.quantity + 1)} className={step}>+</button>
                  <button onClick={() => remove(l.productId)} className="ml-3 text-muted underline">Remove</button>
                </div>
              </div>
              <p className="font-medium">{inr(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl bg-cream p-6">
        <h2 className="font-serif text-2xl text-forest">Summary</h2>
        <CouponBox error={q?.couponError} applied={q?.coupon} />
        {q?.error && <p role="alert" className="text-sm text-terracotta">{q.error}</p>}
        {q && !q.error && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(q.subtotal)}</dd></div>
            {q.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount</dt><dd>−{inr(q.discount)}</dd></div>}
            <div className="flex justify-between text-muted"><dt>Delivery</dt><dd>Calculated at checkout</dd></div>
            <div className="flex justify-between border-t border-sage/40 pt-2 font-medium"><dt>Total</dt><dd>{inr(q.subtotal - q.discount)}</dd></div>
          </dl>
        )}
        <Link href="/checkout" className="block rounded-full bg-forest py-3 text-center text-sm text-white">Proceed to Checkout</Link>
        <Link href="/shop" className="block text-center text-sm text-muted underline">Continue shopping</Link>
      </aside>
    </div>
  );
}
