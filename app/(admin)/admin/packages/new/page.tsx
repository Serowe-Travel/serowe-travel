import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PackageForm } from "@/components/admin/PackageForm";
import { createPackage } from "@/app/(admin)/admin/packages/actions";

export default function NewPackagePage() {
  return (
    <div>
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-gold-dark"
      >
        <ArrowLeft size={16} /> Back to packages
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        New Package
      </h1>
      <p className="mt-1 text-ink-soft">
        Fill in the details below. Set status to “Published” to show it on the
        website.
      </p>

      <div className="mt-8">
        <PackageForm action={createPackage} submitLabel="Create Package" />
      </div>
    </div>
  );
}
