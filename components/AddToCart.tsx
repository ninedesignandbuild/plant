"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartLine } from "./CartProvider";

export default function AddToCart({ line, stock }: { line: Omit<CartLine, "quantity">; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (stock < 1) return <p className="mt-6 text-terracotta">Out of stock</p>;
  const max = Math.min(stock, 20);
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div role="group" aria-label="Quantity" className="flex items-center rounded-full border border-sage/60">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10">−</button>
        <span className="w-8 text-center" aria-live="polite">{qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(max, q + 1))} className="h-10 w-10">+</button>
      </div>
      <button onClick={() => { add(line, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }} className="rounded-full bg-forest px-6 py-3 text-sm text-white">{added ? "Added to cart" : "Add to Cart"}</button>
      <button onClick={() => { add(line, qty); router.push("/checkout"); }} className="rounded-full bg-terracotta px-6 py-3 text-sm text-white">Buy Now</button>
    </div>
  );
}
