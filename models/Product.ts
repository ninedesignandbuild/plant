import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: String, shortDescription: String,
  category: { type: String, required: true, index: true }, subcategory: String,
  price: { type: Number, required: true, min: 0 }, compareAtPrice: Number,
  sku: { type: String, unique: true, sparse: true },
  stock: { type: Number, default: 0, min: 0 },
  images: [String],
  variants: [{ label: String, price: Number, stock: Number }],
  plantType: String, lightRequirement: String, waterRequirement: String,
  careLevel: { type: String, enum: ["easy", "medium", "expert"], default: "easy" },
  petFriendly: { type: Boolean, default: false }, height: String, potSize: String,
  isFeatured: { type: Boolean, default: false }, isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }, // `isNew` is reserved by Mongoose
  ratings: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
ProductSchema.index({ name: "text" });
ProductSchema.index({ createdAt: -1 });

export const Product = models.Product || model("Product", ProductSchema);
