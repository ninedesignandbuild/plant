// Central delivery config (₹). The admin settings page will override these later.
export const DELIVERY = { standard: 49, express: 99, pickup: 0, freeAbove: 999 } as const;
export type DeliveryMethod = "standard" | "express" | "pickup";
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"] as const;
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export const CANCELLABLE = ["pending", "confirmed", "processing", "packed"]; // customers can cancel until the order ships
export const INQUIRY_STATUSES = ["new", "contacted", "in_progress", "completed", "cancelled"] as const;
