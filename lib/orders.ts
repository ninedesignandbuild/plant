import mongoose from "mongoose";
import { Product } from "@/models/Product";

// Atomic all-or-nothing stock decrement (transactions need an Atlas/replica-set MongoDB).
export async function decrementStock(items: { product: unknown; quantity: number }[]) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const i of items) {
        const r = await Product.updateOne({ _id: i.product, stock: { $gte: i.quantity } }, { $inc: { stock: -i.quantity } }, { session });
        if (!r.modifiedCount) throw new Error("OUT_OF_STOCK");
      }
    });
  } finally { await session.endSession(); }
}

export const restoreStock = (items: { product: unknown; quantity: number }[]) =>
  Product.bulkWrite(items.map((i) => ({ updateOne: { filter: { _id: i.product }, update: { $inc: { stock: i.quantity } } } })));
