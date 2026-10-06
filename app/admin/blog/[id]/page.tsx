import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { isId } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models/BlogPost";

export const metadata = { title: "Edit post" };
export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isId(id)) notFound();
  await connectDB();
  const p = await BlogPost.findById(id).lean();
  if (!p) notFound();
  return <><h1 className="mb-6 font-serif text-3xl text-forest">Edit post</h1><BlogForm initial={JSON.parse(JSON.stringify(p))} /></>;
}
