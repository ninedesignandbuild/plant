import ShopView from "@/components/ShopView";

export const metadata = { title: "Shop plants", description: "Indoor and outdoor plants, planters and plant care from NYNI Nursery.", alternates: { canonical: "/shop" } };
export default async function Shop({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ShopView title="Shop" description="Healthy plants, grown at our nursery and delivered across Hyderabad." action="/shop" raw={await searchParams} />;
}
