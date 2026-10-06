"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inr } from "@/lib/utils";
import { field, btn, send } from "./ui";

type C = { _id: string; code: string; type: string; value: number; minOrder: number; maxDiscount?: number; expiresAt?: string; usageLimit?: number; usedCount: number; isActive: boolean };

export default function CouponAdmin({ coupons }: { coupons: C[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function run(p: Promise<Response>) {
    const res = await p;
    if (res.ok) { setError(""); router.refresh(); } else setError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
    return res.ok;
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    const s = (k: string) => String(f.get(k) ?? "").trim(), n = (k: string) => (s(k) ? Number(s(k)) : undefined);
    const ok = await run(send("POST", "/api/admin/coupons", { code: s("code"), type: s("type"), value: Number(s("value")), minOrder: n("minOrder") ?? 0, maxDiscount: n("maxDiscount"), usageLimit: n("usageLimit"), expiresAt: s("expiresAt") || undefined }));
    if (ok) form.reset();
  }
  return (
    <>
      <form onSubmit={create} className="grid gap-3 rounded-2xl bg-cream p-5 sm:grid-cols-3">
        <input name="code" required placeholder="Code (e.g. MONSOON15)" aria-label="Code" className={field} />
        <select name="type" aria-label="Discount type" className={field}><option value="percent">Percentage</option><option value="fixed">Fixed amount (₹)</option></select>
        <input name="value" type="number" step="any" required placeholder="Value" aria-label="Value" className={field} />
        <input name="minOrder" type="number" placeholder="Minimum order (₹)" aria-label="Minimum order" className={field} />
        <input name="maxDiscount" type="number" placeholder="Maximum discount (₹)" aria-label="Maximum discount" className={field} />
        <input name="usageLimit" type="number" placeholder="Usage limit" aria-label="Usage limit" className={field} />
        <label className="flex items-center gap-2 text-sm text-muted">Expires <input name="expiresAt" type="date" className={field} /></label>
        <button className={`${btn} sm:col-span-2`}>Create coupon</button>
        {error && <p role="alert" className="text-sm text-terracotta sm:col-span-3">{error}</p>}
      </form>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-muted"><tr><th className="p-2">Code</th><th>Discount</th><th>Used</th><th>Expires</th><th>Status</th><th /></tr></thead>
        <tbody>{coupons.map((c) => (
          <tr key={c._id} className="border-t border-sage/30">
            <td className="p-2 font-medium">{c.code}</td>
            <td>{c.type === "percent" ? `${c.value}%` : inr(c.value)}{c.minOrder ? ` over ${inr(c.minOrder)}` : ""}{c.maxDiscount ? `, max ${inr(c.maxDiscount)}` : ""}</td>
            <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
            <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "—"}</td>
            <td><button onClick={() => run(send("PATCH", `/api/admin/coupons/${c._id}`, { isActive: !c.isActive }))} className="underline">{c.isActive ? "Active" : "Inactive"}</button></td>
            <td><button onClick={() => confirm(`Delete ${c.code}?`) && run(send("DELETE", `/api/admin/coupons/${c._id}`))} className="text-terracotta underline">Delete</button></td>
          </tr>))}</tbody>
      </table>
    </>
  );
}
