"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updatePlatformSettings } from "@/lib/actions/platform.actions";
import { useRouter } from "next/navigation";

export default function SettingsForm({ settings }: { settings: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [registrationEnabled, setRegistrationEnabled] = useState(settings.registrationEnabled);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    
    const data = {
      platformName: formData.get("platformName"),
      logoUrl: formData.get("logoUrl"),
      themeColor: formData.get("themeColor"),
      supportEmail: formData.get("supportEmail"),
      registrationEnabled,
      maintenanceMode,
    };

    const result = await updatePlatformSettings(data);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Settings updated successfully!");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Platform Settings</h1>
        <p className="text-sm text-zinc-500">Manage global configuration for Catalogger.</p>
      </div>

      <form action={onSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900 border-b pb-4">General Details</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" name="platformName" required defaultValue={settings.platformName} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings.supportEmail || ""} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="logoUrl">Platform Logo URL</Label>
              <Input id="logoUrl" name="logoUrl" type="url" placeholder="https://..." defaultValue={settings.logoUrl || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeColor">Theme Color</Label>
              <div className="flex gap-2">
                <Input type="color" className="w-12 h-10 p-1" name="themeColor" defaultValue={settings.themeColor} />
                <Input type="text" readOnly className="flex-1" value={settings.themeColor} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900 border-b pb-4">Features & Access</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Seller Registration</Label>
                <p className="text-sm text-zinc-500">Allow new sellers to sign up from the homepage.</p>
              </div>
              <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base text-red-600">Maintenance Mode</Label>
                <p className="text-sm text-zinc-500">Temporarily disable access to all seller dashboards.</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
