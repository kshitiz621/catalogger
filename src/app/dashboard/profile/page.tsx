"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSellerProfile, getSellerProfile } from "@/lib/actions/seller.actions";

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [profile, setProfile] = useState<{name: string | null, email: string}>({ name: "", email: "" });

  useEffect(() => {
    async function load() {
      const data = await getSellerProfile();
      if (data) {
        setProfile({ name: data.name, email: data.email });
      }
      setFetching(false);
    }
    load();
  }, []);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = await updateSellerProfile(data);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Profile updated successfully!");
    }
    setLoading(false);
  }

  if (fetching) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Your Profile</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Manage your account details and credentials.</p>
      </div>

      <form action={onSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-[13px] text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-emerald-50 p-4 text-[13px] text-emerald-600">
            {success}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required defaultValue={profile.name || ""} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required defaultValue={profile.email} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" placeholder="Leave blank to keep current password" />
              <p className="text-xs text-muted-foreground">Only enter a password here if you wish to reset it.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
