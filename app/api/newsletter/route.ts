import { formHandler } from "@/lib/formRoute";
import { newsletterSchema } from "@/lib/validations/forms";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

// Upsert: subscribing twice is harmless and never reveals who is already subscribed.
export const POST = formHandler(newsletterSchema, "newsletter", (d) => NewsletterSubscriber.updateOne({ email: d.email }, { email: d.email }, { upsert: true }));
