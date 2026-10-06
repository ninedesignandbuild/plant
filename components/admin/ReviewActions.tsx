"use client";
import { useRouter } from "next/navigation";
import { send } from "./ui";

export default function ReviewActions({ id, hidden }: { id: string; hidden: boolean }) {
  const router = useRouter();
  const run = async (p: Promise<Response>) => { await p; router.refresh(); };
  return (
    <div className="flex gap-3 text-sm">
      <button onClick={() => run(send("PATCH", `/api/admin/reviews/${id}`, { isHidden: !hidden }))} className="underline">{hidden ? "Show" : "Hide"}</button>
      <button onClick={() => confirm("Delete this review?") && run(send("DELETE", `/api/admin/reviews/${id}`))} className="text-terracotta underline">Delete</button>
    </div>
  );
}
