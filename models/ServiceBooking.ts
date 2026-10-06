import { Schema, model, models } from "mongoose";
import { INQUIRY_STATUSES } from "../lib/config";

const ServiceBookingSchema = new Schema({
  name: String, phone: String, email: String, service: String, propertyType: String, location: String, budget: String, preferredDate: String, message: String,
  status: { type: String, enum: INQUIRY_STATUSES, default: "new" },
}, { timestamps: true });

export const ServiceBooking = models.ServiceBooking || model("ServiceBooking", ServiceBookingSchema);
