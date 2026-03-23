import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoreSettingsForm from "./StoreSettingsForm";
import PasswordChangeForm from "./PasswordChangeForm";

export default async function SettingsPage() {
  // @ts-ignore
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!store) {
    return (
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-red-600">Store Not Found</h3>
        <p className="mt-2 text-sm text-gray-500">You do not have a store associated with this account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Store Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Update your store's name and URL slug.</p>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <StoreSettingsForm initialName={store.name} initialSlug={store.slug} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Security</h3>
        <p className="mt-1 text-sm text-gray-500">Update your account password.</p>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
