"use client";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export type Quote = { subtotal: number; discount: number; deliveryFee: number; total: number; coupon?: string; couponError?: string; error?: string; codEnabled?: boolean };

// Totals always come from the server.
export function useQuote(coupon: string, method = "standard") {
  const { lines } = useCart();
  const [q, setQ] = useState<Quote | null>(null);
  useEffect(() => {
    if (!lines.length) { setQ(null); return; }
    const ctl = new AbortController();
    fetch("/api/cart/quote", { method: "POST", headers: { "Content-Type": "application/json" }, signal: ctl.signal,
      body: JSON.stringify({ items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })), coupon: coupon || undefined, deliveryMethod: method }) })
      .then((r) => r.json()).then(setQ).catch(() => {});
    return () => ctl.abort();
  }, [lines, coupon, method]);
  return q;
}
