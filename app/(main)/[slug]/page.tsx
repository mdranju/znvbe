"use client";

import { useGetPageBySlugQuery } from "@/src/store/api/pageApi";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/common/BackButton";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function DynamicStaticPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: response, isLoading, isError } = useGetPageBySlugQuery(slug);
  const pageData = response?.data;

  useEffect(() => {
    if (pageData) {
      document.title = pageData.metaTitle || `${pageData.title} | Avlora Wear`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageData.metaDescription || "");
      }
    }
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
          <Skeleton className="w-1/3 h-12 bg-white/10" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-sm border border-black/5">
            <div className="space-y-4">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !pageData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Premium Hero Banner */}
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-blue-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Information
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {pageData.title}.
          </h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="prose prose-lg sm:prose-xl max-w-none text-gray-600">
            <RichTextRenderer 
              content={pageData.content} 
              className="prose-p:leading-loose prose-headings:text-[#0B1221] prose-headings:font-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
