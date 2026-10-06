"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function WishlistButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch("/api/wishlist").then((r) => r.json()).then((d) => setSaved(d.ids.includes(productId))).catch(() => {}); }, [productId]);
  async function toggle() {
    const r = await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
    if (r.status === 401) { router.push(`/login?next=${encodeURIComponent(location.pathname)}`); return; }
    if (r.ok) setSaved((await r.json()).saved);
  }
  return <button onClick={toggle} aria-pressed={saved} className="inline-flex items-center gap-2 rounded-full border border-sage/60 px-5 py-2.5 text-sm"><Heart size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved to wishlist" : "Add to Wishlist"}</button>;
}
