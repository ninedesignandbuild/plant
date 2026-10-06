import EnquiryForm, { type FieldDef } from "@/components/EnquiryForm";
import { PROPERTY_TYPES, SERVICE_NAMES } from "@/lib/content";

export const metadata = { title: "Book a consultation", alternates: { canonical: "/services/book" } };
const fields: FieldDef[] = [
  { name: "name", label: "Your name", required: true }, { name: "phone", label: "Mobile number", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true }, { name: "service", label: "Service", type: "select", required: true, options: SERVICE_NAMES },
  { name: "propertyType", label: "Property type", type: "select", required: true, options: PROPERTY_TYPES }, { name: "location", label: "Location", required: true },
  { name: "budget", label: "Budget (optional)" }, { name: "preferredDate", label: "Preferred date", type: "date" },
  { name: "message", label: "Tell us about your space", type: "textarea" },
];
export default function Book() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-5xl text-forest">Book a consultation</h1>
      <p className="mb-8 mt-3 text-muted">Tell us what you have in mind and our team will get in touch.</p>
      <EnquiryForm endpoint="/api/service-bookings" fields={fields} submit="Request consultation" success="Thank you. We've received your request and will contact you shortly." />
    </div>
  );
}
