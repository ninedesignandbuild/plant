"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useQuote } from "@/components/useQuote";
import CouponBox from "@/components/CouponBox";
import { inr } from "@/lib/utils";

declare global { interface Window { Razorpay: new (o: Record<string, unknown>) => { open(): void } } }
const input = "w-full rounded-xl border border-sage/50 bg-white px-4 py-3 text-sm";
const methods = [["standard", "Standard delivery"], ["express", "Express delivery"], ["pickup", "Pickup from nursery"]] as const;
const pays = [["razorpay", "Pay online (UPI, cards, net banking)"], ["cod", "Cash on delivery"]] as const;
const post = (url: string, body: unknown) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default function Checkout() {
  const router = useRouter();
  const { lines, coupon, clear } = useCart();
  const [method, setMethod] = useState<string>("standard");
  const [pay, setPay] = useState<string>("razorpay");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const q = useQuote(coupon, method);
  const key = useRef("");
  useEffect(() => { key.current = crypto.randomUUID(); }, [lines, method, q?.coupon]);

  if (!lines.length) return <section className="px-4 py-20 text-center"><h1 className="font-serif text-4xl text-forest">Your cart is empty</h1><Link href="/shop" className="mt-4 inline-block text-forest underline">Browse plants</Link></section>;

  async function place(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res = await post("/api/orders", {
      items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })), coupon: q?.coupon, deliveryMethod: method, paymentMethod: pay, idempotencyKey: key.current,
      address: { name: f.name, phone: f.phone, line1: f.line1, area: f.area || undefined, city: f.city, state: f.state, pincode: f.pincode, landmark: f.landmark || undefined },
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(d.error ?? "Could not place your order. Try again."); setBusy(false); return; }
    if (!d.razorpayOrderId) { clear(); router.push(`/order-confirmation/${d.orderId}`); return; }
    new window.Razorpay({
      key: d.keyId, amount: d.amount, currency: "INR", order_id: d.razorpayOrderId, name: "NYNI Nursery", prefill: { name: f.name, contact: f.phone }, theme: { color: "#2F4D39" },
      handler: async (r: Record<string, string>) => {
        const v = await post("/api/payments/verify", r);
        const vd = await v.json().catch(() => ({}));
        if (v.ok) { clear(); router.push(`/order-confirmation/${vd.orderId}`); } else { setError(vd.error ?? "Payment could not be verified."); setBusy(false); }
      },
      modal: { ondismiss: () => { setBusy(false); setError("Payment was not completed. You can try again."); } },
    }).open();
  }

  const radios = (name: string, list: readonly (readonly [string, string])[], value: string, set: (v: string) => void) => list.map(([k, t]) => (
    <label key={k} className="flex items-center gap-2 text-sm"><input type="radio" name={name} checked={value === k} onChange={() => set(k)} /> {t}</label>
  ));

  return (
    <form onSubmit={place} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="space-y-8">
        <h1 className="font-serif text-4xl text-forest">Checkout</h1>
        <fieldset className="grid gap-3 sm:grid-cols-2"><legend className="mb-3 font-medium">Delivery address</legend>
          <input name="name" required aria-label="Full name" placeholder="Full name" autoComplete="name" className={input} />
          <input name="phone" required pattern="[6-9][0-9]{9}" aria-label="Mobile number" placeholder="Mobile number (10 digits)" autoComplete="tel-national" className={input} />
          <input name="line1" required aria-label="House / flat and street" placeholder="House / flat, street" autoComplete="address-line1" className={`${input} sm:col-span-2`} />
          <input name="area" aria-label="Area" placeholder="Area" className={input} />
          <input name="landmark" aria-label="Landmark" placeholder="Landmark (optional)" className={input} />
          <input name="city" required defaultValue="Hyderabad" aria-label="City" placeholder="City" className={input} />
          <input name="state" required defaultValue="Telangana" aria-label="State" placeholder="State" className={input} />
          <input name="pincode" required pattern="[1-9][0-9]{5}" aria-label="Pincode" placeholder="Pincode" autoComplete="postal-code" className={input} />
        </fieldset>
        <fieldset className="space-y-2"><legend className="mb-2 font-medium">Delivery method</legend>{radios("method", methods, method, setMethod)}</fieldset>
        <fieldset className="space-y-2"><legend className="mb-2 font-medium">Payment</legend>{radios("pay", q?.codEnabled === false ? pays.filter(([k]) => k !== "cod") : pays, pay, setPay)}</fieldset>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl bg-cream p-6">
        <h2 className="font-serif text-2xl text-forest">Order summary</h2>
        <ul className="space-y-1 text-sm">{lines.map((l) => <li key={l.productId} className="flex justify-between"><span>{l.name} × {l.quantity}</span><span>{inr(l.price * l.quantity)}</span></li>)}</ul>
        <CouponBox error={q?.couponError} applied={q?.coupon} />
        {q?.error && <p role="alert" className="text-sm text-terracotta">{q.error}</p>}
        {q && !q.error && (
          <dl className="space-y-2 border-t border-sage/40 pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(q.subtotal)}</dd></div>
            {q.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount</dt><dd>−{inr(q.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Delivery</dt><dd>{q.deliveryFee ? inr(q.deliveryFee) : "Free"}</dd></div>
            <div className="flex justify-between font-medium"><dt>Total</dt><dd>{inr(q.total)}</dd></div>
          </dl>
        )}
        {error && <p role="alert" className="text-sm text-terracotta">{error}</p>}
        <button disabled={busy || !q || !!q.error} className="w-full rounded-full bg-forest py-3 text-sm text-white disabled:opacity-60">{busy ? "Please wait…" : pay === "cod" ? "Place order" : "Pay now"}</button>
      </aside>
    </form>
  );
}
