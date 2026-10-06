import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  userName: String, rating: { type: Number, required: true, min: 1, max: 5 }, title: String, comment: String,
  verifiedPurchase: { type: Boolean, default: true }, isHidden: { type: Boolean, default: false },
}, { timestamps: true });
ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per customer per product

export const Review = models.Review || model("Review", ReviewSchema);
