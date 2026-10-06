import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models/BlogPost";

type Props = { params: Promise<{ slug: string }> };
const getPost = cache(async (slug: string) => {
  await connectDB();
  const d = await BlogPost.findOne({ slug, isPublished: true }).lean();
  return d ? JSON.parse(JSON.stringify(d)) : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  const description = p.seoDescription || p.excerpt;
  return { title: p.seoTitle || p.title, description, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { title: p.seoTitle || p.title, description, type: "article", images: p.featuredImage ? [p.featuredImage] : undefined } };
}

export default async function Post({ params }: Props) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, image: p.featuredImage, datePublished: p.publishedAt, dateModified: p.updatedAt, author: { "@type": "Organization", name: p.author } };
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <Link href={`/blog?category=${encodeURIComponent(p.category)}`} className="text-sm text-terracotta">{p.category}</Link>
      <h1 className="mt-2 font-serif text-5xl leading-tight text-forest">{p.title}</h1>
      <p className="mt-2 text-sm text-muted">By {p.author} · {new Date(p.publishedAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
      {p.featuredImage && <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-cream"><Image src={p.featuredImage} alt="" fill priority sizes="672px" className="object-cover" /></div>}
      <div className="mt-6">{p.content.split(/\n{2,}/).map((b: string, i: number) => b.startsWith("## ")
        ? <h2 key={i} className="mt-8 font-serif text-3xl text-forest">{b.slice(3)}</h2>
        : <p key={i} className="mt-4 whitespace-pre-line leading-relaxed">{b}</p>)}</div>
    </article>
  );
}
