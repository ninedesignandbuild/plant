const flow = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"] as const;

export default function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") return <p className="rounded-xl bg-cream p-4 text-terracotta">This order was cancelled.</p>;
  const at = flow.indexOf(status as never);
  return (
    <ol aria-label="Order progress" className="space-y-3">
      {flow.map((s, i) => (
        <li key={s} aria-current={i === at ? "step" : undefined} className={`flex items-center gap-3 text-sm capitalize ${i <= at ? "text-forest" : "text-muted"}`}>
          <span aria-hidden className={`h-3 w-3 rounded-full ${i <= at ? "bg-forest" : "border border-sage"}`} />{s.replace(/_/g, " ")}
        </li>
      ))}
    </ol>
  );
}
