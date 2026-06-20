import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login");

  const name = profile?.full_name || user.email || "Staff";
  const role = profile?.role || "staff";

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <Sidebar name={name} role={role} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
