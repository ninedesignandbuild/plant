import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrder: { type: Number, default: 0 }, maxDiscount: Number, expiresAt: Date, usageLimit: Number,
  usedCount: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Coupon = models.Coupon || model("Coupon", CouponSchema);
