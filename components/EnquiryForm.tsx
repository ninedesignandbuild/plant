"use client";
import { useState } from "react";

export type FieldDef = { name: string; label: string; type?: "text" | "email" | "tel" | "date" | "textarea" | "select"; required?: boolean; options?: readonly string[] };
const input = "w-full rounded-xl border border-sage/50 bg-white px-4 py-3 text-sm";

export default function EnquiryForm({ endpoint, fields, submit, success }: { endpoint: string; fields: FieldDef[]; submit: string; success: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("busy"); setError("");
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    if (res.ok) { setState("done"); return; }
    setError((await res.json().catch(() => ({}))).error ?? "Something went wrong. Please try again."); setState("idle");
  }
  if (state === "done") return <p role="status" className="rounded-2xl bg-cream p-6 text-forest">{success}</p>;
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      {fields.map((f) => {
        const c = { name: f.name, required: f.required, "aria-label": f.label, title: f.label, className: input };
        return (
          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            {f.type === "textarea" ? <textarea {...c} rows={4} placeholder={f.label} />
              : f.type === "select" ? <select {...c} defaultValue=""><option value="" disabled>{f.label}</option>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>
              : <input {...c} type={f.type ?? "text"} placeholder={f.type === "date" ? undefined : f.label} />}
          </div>
        );
      })}
      {error && <p role="alert" className="text-sm text-terracotta sm:col-span-2">{error}</p>}
      <button disabled={state === "busy"} className="rounded-full bg-forest px-6 py-3 text-sm text-white disabled:opacity-60 sm:col-span-2">{state === "busy" ? "Sending…" : submit}</button>
    </form>
  );
}
