import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(1).max(72) });
export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Enter your full name").max(60),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});
