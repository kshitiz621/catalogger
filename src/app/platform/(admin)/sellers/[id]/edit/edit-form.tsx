"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSeller } from "@/lib/actions/platform.actions";

export default function EditSellerForm({ seller }: { seller: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(seller.status);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      storeName: formData.get("storeName"),
      storeSlug: formData.get("storeSlug"),
      status,
    };

    const result = await updateSeller(seller.id, data);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/platform/sellers");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/platform/sellers" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-zinc-100">
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Edit Seller</h1>
          <p className="text-sm text-zinc-500">Update seller account and store details.</p>
        </div>
      </div>

      <form action={onSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-zinc-900">Seller Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <Label>Account Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required defaultValue={seller.name || ""} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required defaultValue={seller.email} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Reset Password</Label>
              <Input id="password" name="password" type="text" placeholder="Leave blank to keep current password" />
              <p className="text-xs text-zinc-500">Only enter a password here if you wish to reset it.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <Store className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-900">Store Provisioning</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" name="storeName" required defaultValue={seller.store?.name || ""} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeSlug">URL Slug</Label>
              <Input id="storeSlug" name="storeSlug" required defaultValue={seller.store?.slug || ""} />
              <p className="text-xs text-zinc-500">catalogger.com/store/<b>slug</b></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/platform/sellers" className="inline-flex h-9 px-4 items-center justify-center rounded-md border border-input bg-transparent hover:bg-zinc-100 text-sm font-medium">
            Cancel
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
