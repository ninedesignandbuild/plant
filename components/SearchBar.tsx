"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type S = { label: string; href: string; type: string };

export default function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<S[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (q.trim().length < 2) { setItems([]); return; }
    const ctl = new AbortController();
    const t = setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal }).then((r) => r.json()).then((d) => setItems(d.suggestions ?? [])).catch(() => {}), 250);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);
  return (
    <form role="search" action="/search" onSubmit={(e) => { e.preventDefault(); setOpen(false); router.push(`/search?q=${encodeURIComponent(q.trim())}`); }} className="relative">
      <input type="search" name="q" value={q} autoComplete="off" aria-label="Search" aria-autocomplete="list" placeholder="Search plants, planters, articles"
        onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-full border border-sage/50 bg-white px-5 py-3 text-sm" />
      {open && items.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full rounded-2xl bg-white p-2 shadow-xl">
          {items.map((s) => <li key={s.href}><Link href={s.href} className="flex justify-between rounded-lg px-3 py-2 text-sm hover:bg-cream"><span>{s.label}</span><span className="text-xs text-muted">{s.type}</span></Link></li>)}
        </ul>
      )}
    </form>
  );
}
