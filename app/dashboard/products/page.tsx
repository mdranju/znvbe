"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Package } from "lucide-react";
import adminAxiosInstance from "@/src/services/adminAxiosInstance";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { resolveImageUrl } from "@/src/utils/image";
import { useGetAllAdminProductsQuery } from "@/src/store/api/adminApi";
import { TableRowSkeleton } from "@/components/ui/SkeletonComponents";
import { Pagination } from "@/components/dashboard/Pagination";

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteAlert, setDeleteAlert] = useState<{isOpen: boolean; id: string | null}>({ isOpen: false, id: null });

  // RTK Query hook
  const { data: productsData, isLoading } = useGetAllAdminProductsQuery({
    page,
    limit: 12,
    searchTerm: searchTerm || undefined,
  });

  const products = productsData?.data || productsData?.result || [];
  const meta = productsData?.meta || { page: 1, totalPage: 1, total: 0 };
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const confirmDelete = async () => {
    if (!deleteAlert.id) return;
    try {
      await adminAxiosInstance.delete(`/product/delete/${deleteAlert.id}`);
      toast.success("Product Deleted", {
        description: "The product has been successfully removed.",
      });
      setDeleteAlert({ isOpen: false, id: null });
    } catch (error: any) {
      toast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteAlert({ isOpen: true, id });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">Inventory Management.</h1>
          <p className="text-[#0B1221]/40 text-sm font-medium">Manage your products, track stock, and update pricing.</p>
        </div>
        <Link 
          href="/dashboard/products/create"
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0B1221] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by product name, SKU..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-black/5 rounded-xl font-bold text-xs uppercase tracking-widest text-black/40 hover:text-black hover:border-black/20 transition-all">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[3rem] border border-black/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Product Details</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Category</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Price</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Stock</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-black/10">
                        <Package size={32} />
                      </div>
                      <p className="text-sm font-bold text-[#0B1221]/40 uppercase tracking-widest">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : products.map((product: any) => (
                <tr key={product.id || product._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative border border-black/5">
                        {product.images?.[0] ? (
                          <img 
                            src={resolveImageUrl(product.images[0])} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-black/10">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0B1221] group-hover:text-blue-600 transition-colors">{product.name}</p>
                        <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest mt-1">Slug: {product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-[#0B1221]/60 bg-gray-100 px-3 py-1.5 rounded-lg border border-black/5">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-[#0B1221]">৳{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-red-400 line-through font-bold">৳{product.originalPrice}</p>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-bold text-[#0B1221]">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ${
                      product.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/10' 
                      : 'bg-gray-50 text-gray-500 ring-gray-900/10'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <Link 
                        href={`/dashboard/products/edit/${product.id || product._id}`}
                        className="p-3 bg-white border border-black/5 text-[#0B1221]/40 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id || product._id)}
                        className="p-3 bg-white border border-black/5 text-[#0B1221]/40 hover:text-red-600 hover:border-red-100 hover:shadow-lg rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={meta.totalPage} 
        onPageChange={setPage} 
      />

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
      />
    </div>
  );
}
