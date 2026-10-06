import Image from "next/image";
import Link from "next/link";

export type Post = { slug: string; title: string; excerpt?: string; featuredImage?: string; category: string };

export default function BlogCard({ p }: { p: Post }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-sage/30 bg-white transition hover:shadow-lg">
      <Link href={`/blog/${p.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-cream">{p.featuredImage && <Image src={p.featuredImage} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />}</div>
        <div className="p-4"><p className="text-xs text-terracotta">{p.category}</p><h3 className="mt-1 font-serif text-xl text-forest">{p.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{p.excerpt}</p></div>
      </Link>
    </article>
  );
}
