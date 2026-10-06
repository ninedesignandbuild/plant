"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/content";
import { field, btn, send } from "./ui";

type P = Record<string, unknown> & { _id?: string; tags?: string[] };
const Label = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block space-y-1 text-sm"><span className="text-muted">{t}</span>{children}</label>;

export default function BlogForm({ initial }: { initial?: P }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const v = (k: string) => String(initial?.[k] ?? "");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget), s = (k: string) => String(f.get(k) ?? "").trim();
    const res = await send(initial ? "PUT" : "POST", initial ? `/api/admin/blog/${initial._id}` : "/api/admin/blog", {
      title: s("title"), slug: s("slug"), featuredImage: s("featuredImage"), excerpt: s("excerpt"), content: s("content"), author: s("author"), category: s("category"),
      tags: s("tags").split(",").map((t) => t.trim()).filter(Boolean), isPublished: f.get("isPublished") === "on", seoTitle: s("seoTitle"), seoDescription: s("seoDescription"),
    });
    if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Could not save."); setBusy(false); return; }
    router.push("/admin/blog"); router.refresh();
  }
  async function del() {
    if (!confirm("Delete this post?")) return;
    if ((await send("DELETE", `/api/admin/blog/${initial?._id}`)).ok) { router.push("/admin/blog"); router.refresh(); } else setError("Could not delete.");
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Label t="Title"><input name="title" required defaultValue={v("title")} className={field} /></Label>
      <Label t="Slug (optional)"><input name="slug" defaultValue={v("slug")} pattern="[a-z0-9\-]*" className={field} /></Label>
      <Label t="Category"><select name="category" required defaultValue={v("category")} className={field}><option value="">Select…</option>{BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Label>
      <Label t="Author"><input name="author" defaultValue={v("author")} className={field} /></Label>
      <Label t="Featured image (Cloudinary URL)"><input name="featuredImage" type="url" defaultValue={v("featuredImage")} className={field} /></Label>
      <Label t="Tags (comma separated)"><input name="tags" defaultValue={(initial?.tags ?? []).join(", ")} className={field} /></Label>
      <div className="sm:col-span-2"><Label t="Excerpt"><textarea name="excerpt" rows={2} defaultValue={v("excerpt")} className={field} /></Label></div>
      <div className="sm:col-span-2"><Label t="Content (blank line between paragraphs; start a line with ## for a heading)"><textarea name="content" required rows={12} defaultValue={v("content")} className={field} /></Label></div>
      <Label t="SEO title"><input name="seoTitle" defaultValue={v("seoTitle")} className={field} /></Label>
      <Label t="SEO description"><input name="seoDescription" defaultValue={v("seoDescription")} className={field} /></Label>
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="isPublished" defaultChecked={!!initial?.isPublished} /> Published</label>
      {error && <p role="alert" className="text-sm text-terracotta sm:col-span-2">{error}</p>}
      <div className="flex gap-3 sm:col-span-2"><button disabled={busy} className={btn}>{busy ? "Please wait…" : initial ? "Save changes" : "Create post"}</button>
        {initial && <button type="button" onClick={del} className="rounded-full border border-terracotta px-5 py-2 text-sm text-terracotta">Delete</button>}</div>
    </form>
  );
}
