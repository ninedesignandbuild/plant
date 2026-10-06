import Link from "next/link";
import type { Metadata } from "next";
import { legal } from "@/lib/legal";
import { DEFAULT_SETTINGS, getSettings } from "@/lib/settings";

export const legalMetadata = (key: string): Metadata => {
  const d = legal(DEFAULT_SETTINGS)[key];
  return { title: d.title, description: d.description, alternates: { canonical: `/${key}` } };
};

export default async function Legal({ doc }: { doc: string }) {
  const d = legal(await getSettings())[doc];
  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-5xl text-forest">{d.title}</h1>
      <p className="mt-3 text-muted">{d.description}</p>
      {d.sections.map(([h, ps]) => <section key={h} className="mt-8"><h2 className="font-serif text-2xl text-forest">{h}</h2>{ps.map((p) => <p key={p} className="mt-2 leading-relaxed">{p}</p>)}</section>)}
      <p className="mt-10 text-sm text-muted">Questions? <Link href="/contact" className="text-forest underline">Contact us</Link>.</p>
    </article>
  );
}
