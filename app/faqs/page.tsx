import Link from "next/link";

export const metadata = { title: "FAQs", description: "Answers to common questions about ordering, delivery and plant care.", alternates: { canonical: "/faqs" } };
const faqs: [string, string][] = [
  ["Where do you deliver?", "We deliver across Hyderabad and nearby areas. You can also choose pickup from our nursery at checkout."],
  ["How can I pay?", "Pay online with UPI, cards or net banking through Razorpay, or choose cash on delivery."],
  ["Can I cancel my order?", "Yes, from My orders until it ships. Paid online orders cancelled in time are refunded by our team."],
  ["What if my plant arrives damaged?", "Contact us with photos and we will replace it or refund you. See our Returns page for details."],
  ["Can I order plants in bulk?", "Yes. Send us a Bulk Plant Orders request through the consultation form."],
  ["Do you offer landscaping and garden care?", "Yes, including landscape design, garden setup, indoor plant styling, maintenance and event greenery."],
  ["How do I look after my plant?", "Each plant page lists its light and water needs, and our blog has simple care guides."],
];

export default function FAQs() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <h1 className="font-serif text-5xl text-forest">FAQs</h1>
      <div className="mt-8 divide-y divide-sage/30">{faqs.map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}</div>
      <p className="mt-8 text-sm text-muted">Still need help? <Link href="/contact" className="text-forest underline">Contact us</Link>.</p>
    </section>
  );
}
