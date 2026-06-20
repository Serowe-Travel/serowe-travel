import { getSiteSettings } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, { profile }] = await Promise.all([
    getSiteSettings(),
    getCurrentProfile(),
  ]);
  const canEdit = profile?.role === "admin";

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-ink-soft">
        Manage website settings and social media links.
      </p>

      <div className="mt-8 max-w-xl">
        <SettingsForm settings={settings} canEdit={canEdit} />
      </div>
    </div>
  );
}
