"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
} from "lucide-react";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { AdminModal } from "@/components/ui/AdminModal";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";

import {
  useGetAllAdminPagesQuery,
  useCreateAdminPageMutation,
  useUpdateAdminPageMutation,
  useDeleteAdminPageMutation,
} from "@/src/store/api/adminApi";
import { PageCardSkeleton } from "@/components/ui/SkeletonComponents";

export default function PagesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  // RTK Query hooks
  const { data: pagesData, isLoading } = useGetAllAdminPagesQuery({});
  const [createPage] = useCreateAdminPageMutation();
  const [updatePage] = useUpdateAdminPageMutation();
  const [deletePage] = useDeleteAdminPageMutation();

  const pagesList = pagesData?.data || [];
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "title" && !editingPage) {
        newData.slug = value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
    });
    setEditingPage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content) {
      toast.warning("Incomplete", { description: "Please provide a title, slug, and content." });
      return;
    }
    
    setLoading(true);
    try {
      if (editingPage) {
        await updatePage({
          id: editingPage._id || editingPage.id,
          data: formData,
        }).unwrap();
        toast.success("Success", {
          description: "Page updated successfully",
        });
      } else {
        await createPage(formData).unwrap();
        toast.success("Success", {
          description: "Page created successfully",
        });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Submission Failure:", error);
      const errorMessage =
        error.data?.message ||
        error.message ||
        "Failed to save page details";
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pageData: any) => {
    setEditingPage(pageData);
    setFormData({
      title: pageData.title || "",
      slug: pageData.slug || "",
      content: pageData.content || "",
      metaTitle: pageData.metaTitle || "",
      metaDescription: pageData.metaDescription || "",
    });
    setIsModalOpen(true);
  };

  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  const confirmDelete = async () => {
    if (!deleteAlert.id) return;
    try {
      await deletePage(deleteAlert.id).unwrap();
      toast.success("Deleted", {
        description: "Page removed successfully",
      });
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setDeleteAlert({ isOpen: false, id: null });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteAlert({ isOpen: true, id });
  };

  const filteredPages = pagesList.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">
            Static CMS Pages.
          </h1>
          <p className="text-[#0B1221]/40 text-sm font-medium">
            Manage your site's content pages like About Us, Privacy Policy, etc.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0B1221] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20"
              size={18}
            />
            <input
              type="text"
              placeholder="Search pages by title..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <PageCardSkeleton key={i} />
              ))
          : filteredPages.map((pageData: any) => (
              <div
                key={pageData.id || pageData._id}
                className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl overflow-hidden border border-blue-100 flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pageData)}
                      className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-blue-600 transition-colors shadow-sm"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(pageData.id || pageData._id)}
                      className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#0B1221] tracking-tight line-clamp-1">
                  {pageData.title}
                </h3>
                <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest mt-2 mb-6">
                  Path: /{pageData.slug}
                </p>
                
                <div className="pt-4 border-t border-black/5 text-xs font-medium text-[#0B1221]/40">
                    Last updated: {new Date(pageData.updatedAt || pageData.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? "Edit CMS Page." : "Add New Page."}
        subtitle="Create or refine dynamic static pages containing rich text."
        footer={
          <button
            type="submit"
            form="page-form"
            disabled={loading}
            className="w-full bg-[#0B1221] text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : editingPage ? (
              "Save Page Updates"
            ) : (
              "Publish New Page"
            )}
          </button>
        }
      >
        <form onSubmit={handleSubmit} id="page-form" className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                Page Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                placeholder="e.g. Terms and Conditions"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                required
                readOnly={!!editingPage}
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm ${editingPage ? "opacity-60 cursor-not-allowed" : ""}`}
                placeholder="e.g. terms-and-conditions"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
              Page Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Start writing the page content..."
            />
          </div>

          <div className="space-y-6 pt-6 border-t border-black/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
              SEO Metadata
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                  placeholder="e.g. Terms & Conditions - Avlora Wear"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  rows={2}
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                  placeholder="Brief summary for search engines"
                />
              </div>
            </div>
          </div>
        </form>
      </AdminModal>

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Page"
        message="Are you sure? This page will be permanently removed from the site."
        type="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
      />
    </div>
  );
}
