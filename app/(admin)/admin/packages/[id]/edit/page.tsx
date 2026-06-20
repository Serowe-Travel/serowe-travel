import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/components/admin/PackageForm";
import { updatePackage } from "@/app/(admin)/admin/packages/actions";
import type { Package } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const pkg = data as Package | null;
  if (!pkg) notFound();

  const updateAction = updatePackage.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-gold-dark"
      >
        <ArrowLeft size={16} /> Back to packages
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        Edit Package
      </h1>
      <p className="mt-1 text-ink-soft">{pkg.title}</p>

      <div className="mt-8">
        <PackageForm
          action={updateAction}
          pkg={pkg}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
