"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { premiumToast as toast } from "@/components/ui/PremiumToast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Access Denied", {
          description: "Please login to access the dashboard.",
        });
        router.push("/login?redirect=/dashboard");
      } else if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        toast.error("Permission Denied", {
          description: "You do not have permission to access the admin panel.",
        });
        router.push("/");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#0B1221]/40">Securing Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="pl-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
