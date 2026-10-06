"use client";
import { useState } from "react";
import { field, btn, send } from "./ui";
import type { Settings } from "@/lib/settings";

const text = [["nurseryName", "Nursery name"], ["phone", "Phone"], ["email", "Email"], ["whatsapp", "WhatsApp number (digits with country code)"], ["address", "Address"], ["openingHours", "Opening hours"], ["mapsEmbedUrl", "Google Maps embed URL"], ["instagram", "Instagram URL"], ["facebook", "Facebook URL"], ["youtube", "YouTube URL"]] as const;
const nums = [["standardFee", "Standard delivery fee (₹)"], ["expressFee", "Express delivery fee (₹)"], ["freeAbove", "Free standard delivery above (₹)"], ["minOrder", "Minimum order (₹)"]] as const;

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const f = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { codEnabled: f.get("codEnabled") === "on" };
    for (const [k] of text) body[k] = String(f.get(k) ?? "").trim();
    for (const [k] of nums) body[k] = Number(f.get(k) || 0);
    const res = await send("PUT", "/api/admin/settings", body);
    setMsg(res.ok ? "Saved." : (await res.json().catch(() => ({}))).error ?? "Could not save.");
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {text.map(([k, t]) => <label key={k} className="block space-y-1 text-sm"><span className="text-muted">{t}</span><input name={k} defaultValue={initial[k]} className={field} /></label>)}
      {nums.map(([k, t]) => <label key={k} className="block space-y-1 text-sm"><span className="text-muted">{t}</span><input name={k} type="number" min={0} defaultValue={initial[k]} className={field} /></label>)}
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="codEnabled" defaultChecked={initial.codEnabled} /> Offer cash on delivery</label>
      <div className="flex items-center gap-3 sm:col-span-2"><button className={btn}>Save settings</button><p role="status" className="text-sm text-muted">{msg}</p></div>
    </form>
  );
}
