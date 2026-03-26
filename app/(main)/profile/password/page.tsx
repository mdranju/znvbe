import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { BackButton } from "@/components/common/BackButton";
import Image from "next/image";

export default function ChangePasswordPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProfileSidebar />

        <div className="flex-1 w-full relative">
          <BackButton className="mb-" />
          {/* Decorative background elements */}
          <div className="absolute -z-10 top-10 -left-10 text-orange-400 opacity-50">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 40L40 0H0V40Z" fill="currentColor" />
            </svg>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 relative z-10 max-w-2xl">
            <form className="space-y-6">
              <div className="relative border border-gray-200 rounded-md px-3 py-2">
                <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full py-1 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative border border-gray-200 rounded-md px-3 py-2">
                  <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full py-1 focus:outline-none text-sm"
                  />
                </div>

                <div className="relative border border-gray-200 rounded-md px-3 py-2">
                  <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full py-1 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                className="bg-[#0B1221] text-white px-8 py-3 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Update
              </button>
            </form>
          </div>

          {/* Illustration on the right */}
          <div className="hidden lg:block absolute top-0 right-0 w-64 h-64 -z-10">
            <Image
              src="https://picsum.photos/seed/illustration3/300/300"
              alt="Illustration"
              fill
              className="object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
