"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const field = "w-full rounded-xl border border-sage/50 bg-white px-4 py-3 text-sm";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const register = mode === "register";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error ?? "Something went wrong. Try again."); setBusy(false); return; }
    router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/account");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="font-serif text-4xl text-forest">{register ? "Create account" : "Welcome back"}</h1>
      {register && <input name="name" required autoComplete="name" aria-label="Full name" placeholder="Full name" className={field} />}
      <input name="email" type="email" required autoComplete="email" aria-label="Email" placeholder="Email" className={field} />
      {register && <input name="phone" type="tel" autoComplete="tel-national" aria-label="Mobile number (optional)" placeholder="Mobile number (optional)" className={field} />}
      <input name="password" type="password" required minLength={register ? 8 : 1} autoComplete={register ? "new-password" : "current-password"} aria-label="Password" placeholder="Password" className={field} />
      {error && <p role="alert" className="text-sm text-terracotta">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-forest py-3 text-sm text-white disabled:opacity-60">{busy ? "Please wait…" : register ? "Create account" : "Sign in"}</button>
      <p className="text-center text-sm text-muted">{register ? "Already have an account?" : "New here?"} <Link href={register ? "/login" : "/register"} className="text-forest underline">{register ? "Sign in" : "Create an account"}</Link></p>
    </form>
  );
}
