import { getSiteImageOverrides } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { ImagesManager } from "@/components/admin/ImagesManager";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const [overridesRaw, { profile }] = await Promise.all([
    getSiteImageOverrides(),
    getCurrentProfile(),
  ]);
  const canEdit = profile?.role === "admin" || profile?.role === "staff";

  const overrides: Record<string, string> = {};
  for (const [slot, row] of Object.entries(overridesRaw)) {
    overrides[slot] = row.url;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Images</h1>
      <p className="mt-1 max-w-2xl text-ink-soft">
        Replace any photo on the public website. Upload a new image for a slot
        to override it everywhere it appears, or reset it back to the bundled
        default. Package photos are managed on each package.
      </p>

      <div className="mt-8">
        <ImagesManager overrides={overrides} canEdit={canEdit} />
      </div>
    </div>
  );
}
