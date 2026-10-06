import EnquiryForm, { type FieldDef } from "@/components/EnquiryForm";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Contact us", alternates: { canonical: "/contact" } };
const fields: FieldDef[] = [
  { name: "name", label: "Your name", required: true }, { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Mobile number (optional)", type: "tel" }, { name: "subject", label: "Subject", required: true },
  { name: "message", label: "How can we help?", type: "textarea", required: true },
];
export default async function Contact() {
  const s = await getSettings();
  const wa = s.whatsapp;
  const info = [["Phone", s.phone], ["Email", s.email], ["Address", s.address], ["Opening hours", s.openingHours]].filter(([, v]) => v);
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
      <div>
        <h1 className="font-serif text-5xl text-forest">Contact us</h1>
        <p className="mt-3 text-muted">Questions about a plant, an order or a project? Send us a message and we'll reply soon.</p>
        <dl className="mt-6 space-y-3 text-sm">{info.map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}</dl>
        {wa && <a href={`https://wa.me/${wa}`} className="mt-6 inline-block rounded-full border border-forest px-5 py-2.5 text-sm text-forest hover:bg-forest hover:text-white">Chat with us on WhatsApp</a>}
      </div>
      <EnquiryForm endpoint="/api/contact" fields={fields} submit="Send message" success="Thank you. We've received your message and will get back to you soon." />
    </div>
  );
}
