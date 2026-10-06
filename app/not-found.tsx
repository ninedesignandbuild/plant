import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[50vh] place-items-center bg-cream px-4 text-center">
      <div>
        <h1 className="font-serif text-5xl text-forest">Page not found</h1>
        <p className="mt-2 text-muted">That page may have moved. Browse our plants instead.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-sm text-white">Shop plants</Link>
      </div>
    </section>
  );
}
