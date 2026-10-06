import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { btn } from "@/components/admin/ui";
import { BlogPost } from "@/models/BlogPost";

type Row = { _id: string; title: string; category: string; isPublished: boolean };
export const metadata = { title: "Blog" };
export default async function AdminBlog() {
  await connectDB();
  const posts: Row[] = JSON.parse(JSON.stringify(await BlogPost.find().sort({ createdAt: -1 }).limit(200).lean()));
  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h1 className="font-serif text-3xl text-forest">Blog</h1><Link href="/admin/blog/new" className={btn}>New post</Link></div>
      <table className="w-full text-left text-sm"><thead className="text-muted"><tr><th className="p-2">Title</th><th>Category</th><th>Status</th></tr></thead>
        <tbody>{posts.map((p) => <tr key={p._id} className="border-t border-sage/30"><td className="p-2"><Link href={`/admin/blog/${p._id}`} className="text-forest underline">{p.title}</Link></td><td>{p.category}</td><td>{p.isPublished ? "Published" : "Draft"}</td></tr>)}</tbody></table>
    </>
  );
}
