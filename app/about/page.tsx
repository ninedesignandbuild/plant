import Link from "next/link";

export const metadata = { title: "About us", description: "NYNI Nursery brings fresh, healthy plants and planters to homes across Hyderabad.", alternates: { canonical: "/about" } };
const story = [
  ["Our Story", "NYNI Nursery is a plant nursery serving Hyderabad and nearby areas. We bring fresh, healthy plants and planters from our nursery to your home, with advice to help them thrive."],
  ["Our Mission", "To make greener, healthier spaces simple for everyone, with quality plants, honest advice and reliable delivery."],
  ["Our Vision", "A greener Hyderabad where every home and workplace has plants that thrive. Green today, healthier tomorrow."],
  ["Our Nursery", "Our plants are grown and cared for at the nursery before they reach you. You are always welcome to visit and choose in person."],
  ["Our Team", "A team of plant lovers who can help you choose, plant and care for the right greenery for your space."],
];
const why = [["Premium quality plants", "Healthy and well-cared for"], ["Safe & fast delivery", "Across Hyderabad & nearby areas"], ["Secure payments", "UPI, cards, net banking"], ["Expert guidance", "Plant care and maintenance tips"], ["Personalised support", "We're here to help"]];

export default function About() {
  return (
    <>
      <section className="bg-cream px-4 py-16 text-center"><h1 className="font-serif text-5xl text-forest">About NYNI Nursery</h1><p className="mt-2 text-muted">Grow Green. Live Beautiful.</p></section>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-14">
        {story.map(([h, t]) => <section key={h}><h2 className="font-serif text-3xl text-forest">{h}</h2><p className="mt-2 leading-relaxed">{t}</p></section>)}
      </div>
      <section aria-labelledby="why" className="bg-cream px-4 py-14"><div className="mx-auto max-w-6xl">
        <h2 id="why" className="text-center font-serif text-3xl text-forest">Why NYNI</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{why.map(([h, t]) => <li key={h} className="rounded-2xl bg-white p-5"><p className="font-medium text-forest">{h}</p><p className="mt-1 text-sm text-muted">{t}</p></li>)}</ul>
      </div></section>
      <div className="flex flex-wrap justify-center gap-3 px-4 py-12">
        <Link href="/shop" className="rounded-full bg-forest px-6 py-3 text-sm text-white">Shop plants</Link>
        <Link href="/nursery" className="rounded-full border border-forest px-6 py-3 text-sm text-forest hover:bg-forest hover:text-white">Visit our nursery</Link>
      </div>
    </>
  );
}
