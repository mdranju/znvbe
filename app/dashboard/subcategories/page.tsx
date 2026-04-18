"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Hash } from "lucide-react";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { CustomAlert } from "@/components/ui/CustomAlert";
import {
  useGetAllAdminSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetAllAdminCategoriesQuery,
} from "@/src/store/api/adminApi";

import { CategoryCardSkeleton } from "@/components/ui/SkeletonComponents";

export default function SubcategoryListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  
  // RTK Query hooks
  const { data: subcategoriesData, isLoading } = useGetAllAdminSubcategoriesQuery({});
  const { data: categoriesData } = useGetAllAdminCategoriesQuery({ status: 'active' });
  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();
  
  const subcategories = subcategoriesData?.data || subcategoriesData || [];
  const categories = categoriesData?.data || categoriesData || [];
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    status: "active",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "name") {
        newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", category: "", status: "active" });
    setEditingSubcategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
        toast.error("Required", { description: "Please select a parent category" });
        return;
    }
    setLoading(true);
    try {
      if (editingSubcategory) {
        await updateSubcategory({ 
          id: editingSubcategory._id || editingSubcategory.id, 
          data: formData
        }).unwrap();
        toast.success("Success", { description: "Subcategory updated successfully" });
      } else {
        await createSubcategory(formData).unwrap();
        toast.success("Success", { description: "Subcategory created successfully" });
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error("Error", { description: error.message || "Failed to save subcategory" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sub: any) => {
    setEditingSubcategory(sub);
    setFormData({
      name: sub.name,
      slug: sub.slug,
      category: sub.category?._id || sub.category?.id || sub.category,
      status: sub.status,
    });
    setIsModalOpen(true);
  };

  const [deleteAlert, setDeleteAlert] = useState<{isOpen: boolean; id: string | null}>({ isOpen: false, id: null });

  const confirmDelete = async () => {
    if (!deleteAlert.id) return;
    try {
      await deleteSubcategory(deleteAlert.id).unwrap();
      toast.success("Deleted", { description: "Subcategory removed successfully" });
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  const filteredSubcategories = subcategories.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">Sub-Taxonomy.</h1>
          <p className="text-[#0B1221]/40 text-sm font-medium">Fine-tune your product classification within main categories.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0B1221] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text" 
            placeholder="Search subcategories..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <CategoryCardSkeleton key={i} />)
        ) : (
          filteredSubcategories.map((sub: any) => (
            <div
              key={sub.id || sub._id}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-black/5 text-blue-600">
                  <Hash size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteAlert({ isOpen: true, id: sub.id || sub._id })
                    }
                    className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-[#0B1221] tracking-tight">
                {sub.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                  {sub.category?.name || "Main"}
                </span>
                <span className="text-[10px] text-[#0B1221]/20 font-bold uppercase tracking-widest">
                  • {sub.slug}
                </span>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-black/5">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full ${sub.status === "active" ? "text-emerald-500" : "text-gray-400"}`}
                >
                  {sub.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B1221]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-[#0B1221] tracking-tight">
                {editingSubcategory ? "Update Sub-Taxonomy" : "New Sub-Taxonomy"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <Plus size={24} className="rotate-45 text-black/20" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">Parent Category</label>
                <select 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">Slug</label>
                  <input 
                    type="text" 
                    name="slug"
                    required
                    disabled
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1221] text-white h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Confirm Sub-Taxonomy"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Subcategory"
        message="Are you sure? This will remove this sub-classification."
        type="danger"
        confirmText="Remove"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
      />
    </div>
  );
}
