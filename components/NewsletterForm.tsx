"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: new FormData(form).get("email") }) });
    if (res.ok) { form.reset(); setMsg("You're subscribed. Thank you!"); } else setMsg((await res.json().catch(() => ({}))).error ?? "Could not subscribe. Try again.");
  }
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex gap-2">
        <input id="nl-email" name="email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm text-ink" />
        <button className="rounded-lg bg-terracotta px-4 text-sm text-white">Subscribe</button>
      </div>
      <p role="status" className="mt-2 text-xs">{msg}</p>
    </form>
  );
}
