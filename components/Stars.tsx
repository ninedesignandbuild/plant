export default function Stars({ value }: { value: number }) {
  const r = Math.max(0, Math.min(5, Math.round(value)));
  return <span role="img" aria-label={`${value} out of 5 stars`} className="text-terracotta">{"★".repeat(r)}<span className="text-sage/50">{"★".repeat(5 - r)}</span></span>;
}
