import StatusSelect from "@/components/admin/StatusSelect";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { ServiceBooking } from "@/models/ServiceBooking";

type Row = Record<string, string> & { _id: string };
export const metadata = { title: "Inquiries" };
const when = (d: string) => new Date(d).toLocaleDateString("en-IN");

export default async function Inquiries() {
  await connectDB();
  const [bookings, messages]: Row[][] = await Promise.all([ServiceBooking, ContactMessage].map(async (M) => JSON.parse(JSON.stringify(await M.find().sort({ createdAt: -1 }).limit(50).lean()))));
  return (
    <div className="space-y-10">
      <section><h1 className="mb-3 font-serif text-3xl text-forest">Service enquiries</h1>
        {bookings.length ? <ul className="divide-y divide-sage/30 text-sm">{bookings.map((b) => (
          <li key={b._id} className="grid gap-2 py-3 sm:grid-cols-[1fr_160px]">
            <div><p className="font-medium">{b.name} · {b.service}</p><p className="text-muted">{b.phone} · {b.email} · {b.propertyType}, {b.location}{b.budget && ` · ${b.budget}`}{b.preferredDate && ` · ${b.preferredDate}`}</p>{b.message && <p>{b.message}</p>}<p className="text-xs text-muted">{when(b.createdAt)}</p></div>
            <StatusSelect kind="booking" id={b._id} status={b.status} />
          </li>))}</ul> : <p className="text-muted">No enquiries yet.</p>}</section>
      <section><h2 className="mb-3 font-serif text-3xl text-forest">Contact messages</h2>
        {messages.length ? <ul className="divide-y divide-sage/30 text-sm">{messages.map((m) => (
          <li key={m._id} className="grid gap-2 py-3 sm:grid-cols-[1fr_160px]">
            <div><p className="font-medium">{m.name} · {m.subject}</p><p className="text-muted">{m.email}{m.phone && ` · ${m.phone}`}</p><p>{m.message}</p><p className="text-xs text-muted">{when(m.createdAt)}</p></div>
            <StatusSelect kind="contact" id={m._id} status={m.status} />
          </li>))}</ul> : <p className="text-muted">No messages yet.</p>}</section>
    </div>
  );
}
