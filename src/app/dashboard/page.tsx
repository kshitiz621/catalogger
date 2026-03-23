import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Welcome back, {session?.user?.name || session?.user?.email}!
      </h3>
      <div className="mt-5 border-t border-gray-200 pt-5">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border">
            <dt className="truncate text-sm font-medium text-gray-500">Total Stores</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border">
            <dt className="truncate text-sm font-medium text-gray-500">Active Subscriptions</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
