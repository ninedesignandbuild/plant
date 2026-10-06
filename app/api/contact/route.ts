import { formHandler } from "@/lib/formRoute";
import { contactSchema } from "@/lib/validations/forms";
import { ContactMessage } from "@/models/ContactMessage";

export const POST = formHandler(contactSchema, "contact", (d) => ContactMessage.create(d));
