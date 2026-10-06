"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className="grid min-h-[50vh] place-items-center px-4 text-center">
      <div><h1 className="font-serif text-4xl text-forest">Something went wrong</h1><p className="mt-2 text-muted">Please try again. If it keeps happening, contact us.</p>
        <button onClick={reset} className="mt-6 rounded-full bg-forest px-6 py-3 text-sm text-white">Try again</button></div>
    </section>
  );
}
