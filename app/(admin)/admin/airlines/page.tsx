import { getAirlines } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { AirlinesManager } from "@/components/admin/AirlinesManager";

export const dynamic = "force-dynamic";

export default async function AdminAirlinesPage() {
  const [airlines, { profile }] = await Promise.all([
    getAirlines(false), // include hidden airlines in the admin
    getCurrentProfile(),
  ]);
  const canEdit = profile?.role === "admin" || profile?.role === "staff";

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Airlines</h1>
      <p className="mt-1 max-w-2xl text-ink-soft">
        Manage the airline logos shown in the carousel on the public Airlines
        page. Reorder with the arrows, hide one with the eye, or remove it.
      </p>

      <div className="mt-8">
        <AirlinesManager airlines={airlines} canEdit={canEdit} />
      </div>
    </div>
  );
}
