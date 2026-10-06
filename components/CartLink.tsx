"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative"><ShoppingBag size={20} />
      <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-forest text-[10px] text-white">{count}</span>
    </Link>
  );
}
