import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="container-gemo py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <nav className="flex gap-5 text-sm font-medium">
          <Link href="/admin" className="text-ink hover:text-brand-600">
            Dashboard
          </Link>
          <Link href="/admin/products" className="text-ink hover:text-brand-600">
            Products
          </Link>
          <Link href="/admin/orders" className="text-ink hover:text-brand-600">
            Orders
          </Link>
          <Link href="/admin/reviews" className="text-ink hover:text-brand-600">
            Reviews
          </Link>
        </nav>
        <AdminLogoutButton />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
