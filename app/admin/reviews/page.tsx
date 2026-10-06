import "@/models/Product";
import ReviewActions from "@/components/admin/ReviewActions";
import Stars from "@/components/Stars";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";

type Row = { _id: string; rating: number; title?: string; comment: string; userName: string; isHidden: boolean; createdAt: string; product?: { name: string } };
export const metadata = { title: "Reviews" };
export default async function AdminReviews() {
  await connectDB();
  const reviews: Row[] = JSON.parse(JSON.stringify(await Review.find().populate("product", "name").sort({ createdAt: -1 }).limit(100).lean()));
  return (
    <>
      <h1 className="mb-4 font-serif text-3xl text-forest">Reviews</h1>
      {reviews.length ? <ul className="divide-y divide-sage/30 text-sm">{reviews.map((r) => (
        <li key={r._id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto]">
          <div><p className="font-medium">{r.product?.name ?? "Deleted product"} · <Stars value={r.rating} /> {r.isHidden && <span className="text-terracotta">(hidden)</span>}</p>
            {r.title && <p className="font-medium">{r.title}</p>}<p>{r.comment}</p><p className="text-xs text-muted">{r.userName} · {new Date(r.createdAt).toLocaleDateString("en-IN")}</p></div>
          <ReviewActions id={r._id} hidden={r.isHidden} />
        </li>))}</ul> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">No reviews yet.</p>}
    </>
  );
}
