"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { field, btn, send } from "./ui";

type P = Record<string, unknown> & { _id?: string; images?: string[] };
const text = [["name", "Name"], ["sku", "SKU"], ["shortDescription", "Short description"], ["lightRequirement", "Light requirement"], ["waterRequirement", "Water requirement"], ["height", "Height"], ["potSize", "Pot size"]];
const nums = [["price", "Price (₹)"], ["compareAtPrice", "Original price (₹)"], ["stock", "Stock"]];
const flags = [["isActive", "Published"], ["isBestSeller", "Best seller"], ["isFeatured", "Featured"], ["isNewArrival", "New arrival"], ["petFriendly", "Pet friendly"]];
const Label = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block space-y-1 text-sm"><span className="text-muted">{t}</span>{children}</label>;

export default function ProductForm({ initial, categories }: { initial?: P; categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const v = (k: string) => String(initial?.[k] ?? "");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError("");
    try {
      const sig = await (await fetch("/api/admin/upload-signature")).json();
      if (sig.error) throw new Error(sig.error);
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file); fd.append("api_key", sig.apiKey); fd.append("timestamp", String(sig.timestamp));
        fd.append("folder", sig.folder); fd.append("allowed_formats", sig.allowed); fd.append("signature", sig.signature);
        const r = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error?.message ?? "Upload failed");
        urls.push(j.secure_url);
      }
      setImages((p) => [...p, ...urls].slice(0, 8));
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    setBusy(false);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim(), b = (k: string) => f.get(k) === "on";
    const body = {
      name: s("name"), category: s("category"), price: Number(s("price")), compareAtPrice: s("compareAtPrice") ? Number(s("compareAtPrice")) : null, stock: Number(s("stock")),
      sku: s("sku"), shortDescription: s("shortDescription"), description: s("description"), lightRequirement: s("lightRequirement"), waterRequirement: s("waterRequirement"),
      height: s("height"), potSize: s("potSize"), careLevel: s("careLevel"), images,
      petFriendly: b("petFriendly"), isFeatured: b("isFeatured"), isBestSeller: b("isBestSeller"), isNewArrival: b("isNewArrival"), isActive: b("isActive"),
    };
    const res = await send(initial ? "PUT" : "POST", initial ? `/api/admin/products/${initial._id}` : "/api/admin/products", body);
    if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Could not save."); setBusy(false); return; }
    router.push("/admin/products"); router.refresh();
  }

  async function del() {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await send("DELETE", `/api/admin/products/${initial?._id}`);
    if (res.ok) { router.push("/admin/products"); router.refresh(); } else setError("Could not delete.");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {text.map(([k, t]) => <Label key={k} t={t}><input name={k} required={k === "name"} defaultValue={v(k)} className={field} /></Label>)}
      <Label t="Category"><select name="category" required defaultValue={v("category")} className={field}><option value="">Select…</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Label>
      <Label t="Care level"><select name="careLevel" defaultValue={v("careLevel") || "easy"} className={field}><option value="easy">Easy</option><option value="medium">Medium</option><option value="expert">Expert</option></select></Label>
      {nums.map(([k, t]) => <Label key={k} t={t}><input name={k} type="number" min={0} step="any" required={k !== "compareAtPrice"} defaultValue={v(k)} className={field} /></Label>)}
      <div className="sm:col-span-2"><Label t="Description"><textarea name="description" rows={5} defaultValue={v("description")} className={field} /></Label></div>
      <fieldset className="flex flex-wrap gap-4 text-sm sm:col-span-2"><legend className="sr-only">Options</legend>
        {flags.map(([k, t]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" name={k} defaultChecked={initial ? !!initial[k] : k === "isActive"} /> {t}</label>)}
      </fieldset>
      <div className="space-y-2 sm:col-span-2">
        <Label t="Images (up to 8, JPG/PNG/WebP)"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => upload(e.target.files)} className={field} /></Label>
        <ul className="flex flex-wrap gap-3">{images.map((src) => (
          <li key={src} className="relative h-24 w-24 overflow-hidden rounded-xl bg-cream"><Image src={src} alt="" fill sizes="96px" className="object-cover" />
            <button type="button" aria-label="Remove image" onClick={() => setImages((p) => p.filter((x) => x !== src))} className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white/90 text-xs">×</button></li>
        ))}</ul>
      </div>
      {error && <p role="alert" className="text-sm text-terracotta sm:col-span-2">{error}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <button disabled={busy} className={btn}>{busy ? "Please wait…" : initial ? "Save changes" : "Create product"}</button>
        {initial && <button type="button" onClick={del} className="rounded-full border border-terracotta px-5 py-2 text-sm text-terracotta">Delete</button>}
      </div>
    </form>
  );
}
