import { z } from "zod";

export const cartSchema = z.object({
  items: z.array(z.object({ productId: z.string().regex(/^[a-f\d]{24}$/i), quantity: z.number().int().min(1).max(20) })).min(1).max(50),
  coupon: z.string().max(30).optional(),
  deliveryMethod: z.enum(["standard", "express", "pickup"]).default("standard"),
});
export const orderSchema = cartSchema.extend({
  paymentMethod: z.enum(["razorpay", "cod"]),
  idempotencyKey: z.string().min(8).max(64),
  address: z.object({
    name: z.string().trim().min(2).max(60), phone: z.string().regex(/^[6-9]\d{9}$/),
    line1: z.string().trim().min(3).max(120), area: z.string().trim().max(80).optional(),
    city: z.string().trim().min(2).max(60), state: z.string().trim().min(2).max(60),
    pincode: z.string().regex(/^[1-9]\d{5}$/), landmark: z.string().trim().max(80).optional(),
  }),
});
