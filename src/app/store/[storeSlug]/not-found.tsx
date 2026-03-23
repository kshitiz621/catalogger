import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">Store Not Found</h2>
          <p className="mt-4 text-base text-gray-600">
            The store catalog you are looking for does not exist or has been removed.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
