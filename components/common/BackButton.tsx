"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`lg:hidden flex items-center gap-1.5 px-3 py-2 -ml-2 text-gray-600 hover:text-black transition-colors active:scale-95 ${className}`}
    >
      <div className="p-1 bg-white rounded-full shadow-sm border border-gray-100">
        <ChevronLeft size={18} />
      </div>
      <span className="text-sm font-bold">Back</span>
    </button>
  );
}
