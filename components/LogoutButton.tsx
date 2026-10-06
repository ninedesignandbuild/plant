"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function out() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
  return <button onClick={out} className="rounded-full border border-forest px-5 py-2 text-sm text-forest hover:bg-forest hover:text-white">Sign out</button>;
}
