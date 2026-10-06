"use client";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function CouponBox({ error, applied }: { error?: string; applied?: string }) {
  const { coupon, setCoupon } = useCart();
  const [v, setV] = useState("");
  useEffect(() => setV(coupon), [coupon]);
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); setCoupon(v.trim().toUpperCase()); }} className="flex gap-2">
        <input value={v} onChange={(e) => setV(e.target.value)} aria-label="Coupon code" placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-sage/50 bg-white px-3 py-2 text-sm" />
        <button className="rounded-full border border-forest px-4 text-sm text-forest">Apply</button>
      </form>
      {error && <p role="alert" className="mt-1 text-sm text-terracotta">{error}</p>}
      {applied && <p className="mt-1 text-sm text-forest">{applied} applied</p>}
    </div>
  );
}
