import { z } from "zod";
import { SERVICE_NAMES, PROPERTY_TYPES } from "../content";

const phone = z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number");
const text = (min: number, max: number) => z.string().trim().min(min).max(max);
export const contactSchema = z.object({ name: text(2, 60), email: z.string().email(), phone: phone.optional().or(z.literal("")), subject: text(3, 120), message: text(10, 2000) });
export const bookingSchema = z.object({
  name: text(2, 60), phone, email: z.string().email(), service: z.enum(SERVICE_NAMES), propertyType: z.enum(PROPERTY_TYPES), location: text(2, 120),
  budget: z.string().trim().max(40).optional(), preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")), message: z.string().trim().max(2000).optional(),
});
export const newsletterSchema = z.object({ email: z.string().email().toLowerCase() });
