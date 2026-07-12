"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export default function PlatformProfilePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    
    // In a real app, you would hit an API endpoint to update the Super Admin user profile
    // e.g. await updateSuperAdminProfile(data)
    
    setTimeout(() => {
      setSuccess("Profile updated successfully (mock)");
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Your Profile</h1>
        <p className="text-sm text-zinc-500">Manage your super admin account details.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {success && (
          <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required value={email} readOnly />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" placeholder="Leave blank to keep current password" />
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
