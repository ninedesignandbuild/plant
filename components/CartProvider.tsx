"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type CartLine = { productId: string; slug: string; name: string; price: number; image?: string; quantity: number };
type Ctx = {
  lines: CartLine[]; count: number; coupon: string; setCoupon: (c: string) => void;
  add: (l: Omit<CartLine, "quantity">, q?: number) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void;
};
const Cart = createContext<Ctx | null>(null);
export function useCart() {
  const c = useContext(Cart);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
const clamp = (n: number) => Math.max(1, Math.min(20, n));

// Guest-friendly cart kept in localStorage; prices are only for display. The server re-prices everything.
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem("nyni_cart") ?? "[]")); setCoupon(localStorage.getItem("nyni_coupon") ?? ""); } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) { localStorage.setItem("nyni_cart", JSON.stringify(lines)); localStorage.setItem("nyni_coupon", coupon); }
  }, [lines, coupon, ready]);

  const add: Ctx["add"] = (l, q = 1) => setLines((p) => p.some((x) => x.productId === l.productId)
    ? p.map((x) => (x.productId === l.productId ? { ...x, quantity: clamp(x.quantity + q) } : x))
    : [...p, { ...l, quantity: clamp(q) }]);
  const setQty = (id: string, q: number) => setLines((p) => p.map((x) => (x.productId === id ? { ...x, quantity: clamp(q) } : x)));
  const remove = (id: string) => setLines((p) => p.filter((x) => x.productId !== id));
  return <Cart.Provider value={{ lines, count: lines.reduce((n, l) => n + l.quantity, 0), coupon, setCoupon, add, setQty, remove, clear: () => setLines([]) }}>{children}</Cart.Provider>;
}
