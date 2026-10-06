import { Schema, model, models } from "mongoose";

const NewsletterSubscriberSchema = new Schema({ email: { type: String, required: true, unique: true, lowercase: true } }, { timestamps: true });

export const NewsletterSubscriber = models.NewsletterSubscriber || model("NewsletterSubscriber", NewsletterSubscriberSchema);
