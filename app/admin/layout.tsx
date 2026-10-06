import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
const nav = [["Dashboard", "/admin"], ["Products", "/admin/products"], ["Orders", "/admin/orders"], ["Coupons", "/admin/coupons"], ["Blog", "/admin/blog"], ["Inquiries", "/admin/inquiries"], ["Reviews", "/admin/reviews"], ["Categories", "/admin/categories"], ["Customers", "/admin/customers"], ["Settings", "/admin/settings"]];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (s?.role !== "admin") redirect("/login?next=/admin");
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[200px_1fr]">
      <nav aria-label="Admin" className="flex gap-2 overflow-x-auto lg:flex-col">
        {nav.map(([t, h]) => <Link key={h} href={h} className="whitespace-nowrap rounded-xl bg-cream px-4 py-2 text-sm hover:bg-sage/30">{t}</Link>)}
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
