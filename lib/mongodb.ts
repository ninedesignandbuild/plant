import mongoose from "mongoose";

const g = globalThis as unknown as { _mongoose?: { conn?: typeof mongoose; p?: Promise<typeof mongoose> } };
const cache = (g._mongoose ??= {});

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cache.conn) return cache.conn;
  cache.p ??= mongoose.connect(uri, { bufferCommands: false });
  cache.conn = await cache.p;
  return cache.conn;
}
