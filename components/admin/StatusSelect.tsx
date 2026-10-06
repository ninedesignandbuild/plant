"use client";
import { useRouter } from "next/navigation";
import { INQUIRY_STATUSES } from "@/lib/config";
import { field, send } from "./ui";

export default function StatusSelect({ kind, id, status }: { kind: "booking" | "contact"; id: string; status: string }) {
  const router = useRouter();
  return (
    <select defaultValue={status} aria-label="Status" className={`${field} capitalize`} onChange={async (e) => { await send("PATCH", "/api/admin/inquiries", { kind, id, status: e.target.value }); router.refresh(); }}>
      {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
    </select>
  );
}
