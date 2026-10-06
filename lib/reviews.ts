import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

export async function refreshRating(productId: unknown) {
  const _id = new mongoose.Types.ObjectId(String(productId));
  const [r] = await Review.aggregate([{ $match: { product: _id, isHidden: false } }, { $group: { _id: null, avg: { $avg: "$rating" }, n: { $sum: 1 } } }]);
  await Product.updateOne({ _id }, { ratings: r ? Math.round(r.avg * 10) / 10 : 0, reviewCount: r?.n ?? 0 });
}

// Only customers whose order containing this product was delivered can review it.
export const eligibleOrder = (userId: string, productId: string) =>
  Order.findOne({ user: userId, orderStatus: "delivered", "items.product": productId }).select("_id").lean();
