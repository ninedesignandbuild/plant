"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
    if (res.ok) router.refresh(); else setError((await res.json().catch(() => ({}))).error ?? "Could not cancel.");
  }
  return <div><button onClick={cancel} className="rounded-full border border-terracotta px-5 py-2 text-sm text-terracotta">Cancel order</button>{error && <p role="alert" className="mt-2 text-sm text-terracotta">{error}</p>}</div>;
}
