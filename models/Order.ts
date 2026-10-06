import { Schema, model, models } from "mongoose";

const Item = new Schema({ product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, name: String, price: Number, quantity: Number, image: String }, { _id: false });
const Address = new Schema({ name: String, phone: String, line1: String, area: String, city: String, state: String, pincode: String, landmark: String }, { _id: false });

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: [Item], shippingAddress: Address,
  subtotal: Number, discount: { type: Number, default: 0 }, deliveryFee: { type: Number, default: 0 }, total: Number, coupon: String,
  deliveryMethod: { type: String, enum: ["standard", "express", "pickup"] },
  paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  orderStatus: { type: String, enum: ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"], default: "pending" },
  razorpayOrderId: { type: String, index: true }, razorpayPaymentId: String, razorpaySignature: String, trackingNumber: String, shippingProvider: String,
  idempotencyKey: { type: String, index: { unique: true, sparse: true } },
}, { timestamps: true });

export const Order = models.Order || model("Order", OrderSchema);
