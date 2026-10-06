import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "New post" };
export default function NewPost() { return <><h1 className="mb-6 font-serif text-3xl text-forest">New post</h1><BlogForm /></>; }
