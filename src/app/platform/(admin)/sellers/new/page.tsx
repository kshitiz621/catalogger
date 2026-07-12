"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSeller } from "@/lib/actions/platform.actions";

export default function NewSellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      storeName: formData.get("storeName"),
      storeSlug: formData.get("storeSlug"),
    };

    const result = await createSeller(data);
    
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add New Seller</h1>
          <p className="text-sm text-zinc-500">Create a new seller account and provision their store.</p>
        </div>
      </div>

      <form action={onSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <User className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-900">Seller Details</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input id="password" name="password" type="text" required placeholder="Minimum 6 characters" />
              <p className="text-xs text-zinc-500">The seller can change this later.</p>
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
              <Input id="storeName" name="storeName" required placeholder="My Awesome Store" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeSlug">URL Slug</Label>
              <Input id="storeSlug" name="storeSlug" required placeholder="my-awesome-store" />
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
            Create Seller
          </Button>
        </div>
      </form>
    </div>
  );
}
