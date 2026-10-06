"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/config";
import { field, btn, send } from "./ui";

type O = { id: string; orderStatus: string; paymentStatus: string; trackingNumber?: string; shippingProvider?: string };
const opts = (l: readonly string[]) => l.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>);

export default function OrderUpdateForm({ o }: { o: O }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res = await send("PATCH", `/api/admin/orders/${o.id}`, f);
    setMsg(res.ok ? "Saved." : (await res.json().catch(() => ({}))).error ?? "Could not save.");
    if (res.ok) router.refresh();
  }
  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-cream p-5 sm:grid-cols-2">
      <label className="space-y-1 text-sm"><span className="text-muted">Order status</span><select name="orderStatus" defaultValue={o.orderStatus} className={`${field} capitalize`}>{opts(ORDER_STATUSES)}</select></label>
      <label className="space-y-1 text-sm"><span className="text-muted">Payment status</span><select name="paymentStatus" defaultValue={o.paymentStatus} className={`${field} capitalize`}>{opts(PAYMENT_STATUSES)}</select></label>
      <label className="space-y-1 text-sm"><span className="text-muted">Shipping provider</span><input name="shippingProvider" defaultValue={o.shippingProvider} className={field} /></label>
      <label className="space-y-1 text-sm"><span className="text-muted">Tracking number</span><input name="trackingNumber" defaultValue={o.trackingNumber} className={field} /></label>
      <div className="flex items-center gap-3 sm:col-span-2"><button className={btn}>Update order</button><p role="status" className="text-sm text-muted">{msg}</p></div>
    </form>
  );
}
