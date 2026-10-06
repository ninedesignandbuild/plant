import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  avatar: String,
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
