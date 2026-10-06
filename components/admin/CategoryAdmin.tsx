"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { field, btn, send } from "./ui";

type C = { _id: string; name: string; slug: string; description?: string; order: number; isActive: boolean };

function CategoryRow({ c }: { c?: C }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    const res = await send(c ? "PUT" : "POST", c ? `/api/admin/categories/${c._id}` : "/api/admin/categories", {
      name: String(f.get("name") ?? "").trim(), description: String(f.get("description") ?? "").trim(), order: Number(f.get("order") || 0), isActive: f.get("isActive") === "on",
    });
    if (res.ok) { setMsg(c ? "Saved." : "Added."); if (!c) form.reset(); router.refresh(); } else setMsg((await res.json().catch(() => ({}))).error ?? "Could not save.");
  }
  async function del() {
    if (!c || !confirm(`Delete ${c.name}?`)) return;
    const res = await send("DELETE", `/api/admin/categories/${c._id}`);
    if (res.ok) router.refresh(); else setMsg((await res.json().catch(() => ({}))).error ?? "Could not delete.");
  }
  return (
    <form onSubmit={submit} className="grid items-center gap-2 rounded-2xl bg-cream p-3 sm:grid-cols-[1fr_2fr_80px_auto_auto]">
      <input name="name" required defaultValue={c?.name} placeholder="Category name" aria-label="Name" className={field} />
      <input name="description" defaultValue={c?.description} placeholder="Description" aria-label="Description" className={field} />
      <input name="order" type="number" min={0} defaultValue={c?.order ?? 0} aria-label="Order" title="Display order" className={field} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={c ? c.isActive : true} /> Enabled</label>
      <div className="flex gap-2"><button className={btn}>{c ? "Save" : "Add"}</button>{c && <button type="button" onClick={del} className="rounded-full border border-terracotta px-4 py-2 text-sm text-terracotta">Delete</button>}</div>
      <p role="status" className="text-xs text-muted sm:col-span-5">{msg || (c ? `/shop/${c.slug}` : "New category")}</p>
    </form>
  );
}

export default function CategoryAdmin({ categories }: { categories: C[] }) {
  return <div className="space-y-3"><CategoryRow />{categories.map((c) => <CategoryRow key={c._id} c={c} />)}</div>;
}
