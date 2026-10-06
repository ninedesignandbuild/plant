import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/admin";

export const metadata = { title: "Add product" };
export default async function NewProduct() {
  return <><h1 className="mb-6 font-serif text-3xl text-forest">Add product</h1><ProductForm categories={await getCategories()} /></>;
}
