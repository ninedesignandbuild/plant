import { formHandler } from "@/lib/formRoute";
import { bookingSchema } from "@/lib/validations/forms";
import { ServiceBooking } from "@/models/ServiceBooking";

export const POST = formHandler(bookingSchema, "booking", (d) => ServiceBooking.create({ ...d, preferredDate: d.preferredDate || undefined }));
