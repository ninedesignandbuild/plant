import CategoryAdmin from "@/components/admin/CategoryAdmin";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";

export const metadata = { title: "Categories" };
export default async function AdminCategories() {
  await connectDB();
  const categories = JSON.parse(JSON.stringify(await Category.find().sort({ order: 1 }).lean()));
  return <><h1 className="mb-2 font-serif text-3xl text-forest">Categories</h1><p className="mb-6 text-sm text-muted">Lower order numbers appear first. A category's URL stays the same if you rename it.</p><CategoryAdmin categories={categories} /></>;
}
