import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories, isId } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export const metadata = { title: "Edit product" };
export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isId(id)) notFound();
  await connectDB();
  const p = await Product.findById(id).lean();
  if (!p) notFound();
  return <><h1 className="mb-6 font-serif text-3xl text-forest">Edit product</h1><ProductForm initial={JSON.parse(JSON.stringify(p))} categories={await getCategories()} /></>;
}
