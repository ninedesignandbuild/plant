import { Schema, model, models } from "mongoose";

const SettingSchema = new Schema({
  key: { type: String, unique: true, required: true },
  nurseryName: String, phone: String, email: String, whatsapp: String, address: String, openingHours: String, mapsEmbedUrl: String,
  standardFee: Number, expressFee: Number, freeAbove: Number, minOrder: Number, codEnabled: Boolean,
  instagram: String, facebook: String, youtube: String,
}, { timestamps: true });

export const Setting = models.Setting || model("Setting", SettingSchema);
