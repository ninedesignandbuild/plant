import Link from "next/link";
import BlogCard, { type Post } from "@/components/BlogCard";
import { BLOG_CATEGORIES } from "@/lib/content";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models/BlogPost";

export const metadata = { title: "Plant care tips", description: "Simple tips for healthier, happier plants.", alternates: { canonical: "/blog" } };
export default async function Blog({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const cat = (BLOG_CATEGORIES as readonly string[]).includes(category ?? "") ? category : undefined;
  await connectDB();
  const posts: Post[] = JSON.parse(JSON.stringify(await BlogPost.find({ isPublished: true, ...(cat && { category: cat }) }).sort({ publishedAt: -1 }).limit(24).lean()));
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-5xl text-forest">Plant Care Tips</h1>
      <p className="mt-2 text-muted">Simple tips for healthier, happier plants.</p>
      <nav aria-label="Categories" className="my-6 flex flex-wrap gap-2 text-sm">
        {[["", "All"], ...BLOG_CATEGORIES.map((c) => [c, c])].map(([c, t]) => <Link key={c} href={c ? `/blog?category=${encodeURIComponent(c)}` : "/blog"} className={`rounded-full px-3 py-1 ${(cat ?? "") === c ? "bg-forest text-white" : "bg-cream"}`}>{t}</Link>)}
      </nav>
      {posts.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <BlogCard key={p.slug} p={p} />)}</div> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">No articles yet in this category.</p>}
    </section>
  );
}
