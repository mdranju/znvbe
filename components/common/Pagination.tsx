"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2rem] border border-black/5 shadow-sm mt-8">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-black/5 text-[#0B1221] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-[#0B1221]/40 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 2 ||
              page === currentPage + 2
            ) {
              return (
                <span key={page} className="text-[#0B1221]/20 px-1">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-black/5 text-[#0B1221] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
