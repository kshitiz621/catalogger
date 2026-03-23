"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData 
        ? `/api/categories/${initialData.id}` 
        : `/api/categories`;
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(initialData ? "Category updated!" : "Category created!");
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg bg-white p-6 rounded-lg shadow border">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name *</label>
        <input 
          type="text" 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" 
          placeholder="e.g. Vintage Clocks"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.push('/dashboard/categories')}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || !name.trim()}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
}
