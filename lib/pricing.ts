import { connectDB } from "./mongodb";
import { Product } from "@/models/Product";
import { Coupon } from "@/models/Coupon";
import type { DeliveryMethod } from "./config";
import { getSettings } from "./settings";

export class CartError extends Error {}

// All prices come from MongoDB. Nothing the browser sends about price is trusted.
export async function priceCart(input: { productId: string; quantity: number }[], couponCode?: string, method: DeliveryMethod = "standard") {
  const merged = new Map<string, number>();
  for (const i of input) merged.set(i.productId, (merged.get(i.productId) ?? 0) + i.quantity);
  await connectDB();
  const products = await Product.find({ _id: { $in: [...merged.keys()] }, isActive: true }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));
  const items = [...merged].map(([id, quantity]) => {
    const p = byId.get(id);
    if (!p) throw new CartError("An item in your cart is no longer available.");
    if (p.stock < quantity) throw new CartError(p.stock ? `Only ${p.stock} of ${p.name} left.` : `${p.name} is out of stock.`);
    return { product: p._id, name: p.name as string, price: p.price as number, quantity, image: p.images?.[0] as string | undefined };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cfg = await getSettings();
  if (subtotal < cfg.minOrder) throw new CartError(`The minimum order is ₹${cfg.minOrder}.`);
  let discount = 0, coupon: string | undefined, couponError: string | undefined;
  if (couponCode) {
    const c = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true }).lean();
    if (!c || (c.expiresAt && c.expiresAt < new Date()) || (c.usageLimit != null && c.usedCount >= c.usageLimit)) couponError = "This coupon isn't valid.";
    else if (subtotal < c.minOrder) couponError = `Add ₹${c.minOrder - subtotal} more to use this coupon.`;
    else {
      const raw = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
      discount = Math.min(raw, c.maxDiscount ?? raw, subtotal); coupon = c.code;
    }
  }
  const fees = { standard: cfg.standardFee, express: cfg.expressFee, pickup: 0 };
  const deliveryFee = method === "standard" && subtotal - discount >= cfg.freeAbove ? 0 : fees[method];
  return { items, subtotal, discount, coupon, couponError, deliveryFee, total: subtotal - discount + deliveryFee };
}
