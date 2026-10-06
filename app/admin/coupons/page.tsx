import CouponAdmin from "@/components/admin/CouponAdmin";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

export const metadata = { title: "Coupons" };
export default async function AdminCoupons() {
  await connectDB();
  const coupons = JSON.parse(JSON.stringify(await Coupon.find().sort({ createdAt: -1 }).lean()));
  return <><h1 className="mb-6 font-serif text-3xl text-forest">Coupons</h1><CouponAdmin coupons={coupons} /></>;
}
