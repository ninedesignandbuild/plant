import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import ShopView from "@/components/ShopView";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
type Cat = { name: string; description?: string } | null;
const getCat = async (slug: string): Promise<Cat> => { await connectDB(); return JSON.parse(JSON.stringify(await Category.findOne({ slug, isActive: true }).lean())); };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { category } = await params;
  const c = await getCat(category);
  return c ? { title: c.name, description: c.description ?? `Shop ${c.name} at NYNI Nursery.`, alternates: { canonical: `/shop/${category}` } } : {};
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const c = await getCat(category);
  if (!c) notFound();
  return <ShopView title={c.name} description={c.description ?? `Healthy ${c.name.toLowerCase()}, grown and cared for at our nursery.`} action={`/shop/${category}`} raw={await searchParams} category={category} />;
}
