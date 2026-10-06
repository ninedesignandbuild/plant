"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const field = "w-full rounded-xl border border-sage/50 bg-white px-4 py-2 text-sm";

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, rating, title: String(f.get("title") ?? ""), comment: String(f.get("comment") ?? "") }) });
    if (res.ok) { router.refresh(); return; }
    setError((await res.json().catch(() => ({}))).error ?? "Could not submit your review."); setBusy(false);
  }
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl bg-cream p-5">
      <h3 className="font-medium">Write a review</h3>
      <fieldset><legend className="sr-only">Rating</legend>
        <div className="flex gap-4 text-sm">{[1, 2, 3, 4, 5].map((n) => <label key={n} className="flex items-center gap-1"><input type="radio" name="rating" checked={rating === n} onChange={() => setRating(n)} /> {n} ★</label>)}</div>
      </fieldset>
      <input name="title" aria-label="Title" placeholder="Title (optional)" className={field} />
      <textarea name="comment" required minLength={5} rows={3} aria-label="Your review" placeholder="Share your experience with this plant" className={field} />
      {error && <p role="alert" className="text-sm text-terracotta">{error}</p>}
      <button disabled={busy} className="rounded-full bg-forest px-5 py-2 text-sm text-white disabled:opacity-60">{busy ? "Submitting…" : "Submit review"}</button>
    </form>
  );
}
