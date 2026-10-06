import { Schema, model, models } from "mongoose";
import { INQUIRY_STATUSES } from "../lib/config";

const ContactMessageSchema = new Schema({
  name: String, email: String, phone: String, subject: String, message: String,
  status: { type: String, enum: INQUIRY_STATUSES, default: "new" },
}, { timestamps: true });

export const ContactMessage = models.ContactMessage || model("ContactMessage", ContactMessageSchema);
