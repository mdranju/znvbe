"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ImageIcon,
  GripVertical,
  Move,
} from "lucide-react";
import { Reorder } from "motion/react";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { AdminModal } from "@/components/ui/AdminModal";
import { resolveImageUrl } from "@/src/utils/image";

import {
  useGetAllAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
} from "@/src/store/api/adminApi";
import { CategoryCardSkeleton } from "@/components/ui/SkeletonComponents";

export default function CategoryListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // RTK Query hooks
  const { data: categoriesData, isLoading } = useGetAllAdminCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [reorderCategories] = useReorderCategoriesMutation();

  const categories = categoriesData?.data || categoriesData || [];
  const [orderList, setOrderList] = useState<any[]>([]);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setOrderList(categories);
    }
  }, [categories]);

  const handleReorderSave = async () => {
    setIsSavingOrder(true);
    try {
      const payload = orderList.map((cat, index) => ({
        id: cat._id || cat.id,
        order: index,
      }));
      await reorderCategories(payload).unwrap();
      toast.success("Success", { description: "Category order saved!" });
      setIsReorderMode(false);
    } catch (error: any) {
      toast.error("Error", { description: "Failed to save order" });
    } finally {
      setIsSavingOrder(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "active",
    isFeatured: false,
    showPoster: false,
    showBanner: false,
    bannerTitle: "",
    bannerSubtitle: "",
    bannerDescription: "",
    showInExplore: false,
    showInHeader: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as any;
    const val = type === "checkbox" ? (e.target as any).checked : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: val };
      if (name === "name") {
        newData.slug = value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;
    if (file) {
      if (name === "bannerImage") {
        setBannerImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setBannerPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      status: "active",
      isFeatured: false,
      showPoster: false,
      showBanner: false,
      bannerTitle: "",
      bannerSubtitle: "",
      bannerDescription: "",
      showInExplore: false,
      showInHeader: false,
    });
    setImage(null);
    setBannerImage(null);
    setPreview("");
    setBannerPreview("");
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();

      // Append all form data fields safely
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value.toString());
        }
      });

      // Append images if they exist - priority given to new uploads
      if (image) {
        data.append("image", image);
      }
      if (bannerImage) {
        data.append("bannerImage", bannerImage);
      }

      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id || editingCategory.id,
          data,
        }).unwrap();
        toast.success("Success", {
          description: "Portfolio updated successfully",
        });
      } else {
        await createCategory(data).unwrap();
        toast.success("Success", {
          description: "Portfolio created successfully",
        });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Submission Failure:", error);
      const errorMessage =
        error.data?.message ||
        error.message ||
        "Failed to save category details";
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      status: category.status || "active",
      isFeatured: category.isFeatured || false,
      showPoster: category.showPoster || false,
      showBanner: category.showBanner || false,
      bannerTitle: category.bannerTitle || "",
      bannerSubtitle: category.bannerSubtitle || "",
      bannerDescription: category.bannerDescription || "",
      showInExplore: category.showInExplore || false,
      showInHeader: category.showInHeader || false,
    });
    setPreview(resolveImageUrl(category.image));
    setBannerPreview(resolveImageUrl(category.bannerImage));
    setIsModalOpen(true);
  };

  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  const confirmDelete = async () => {
    if (!deleteAlert.id) return;
    try {
      await deleteCategory(deleteAlert.id).unwrap();
      toast.success("Deleted", {
        description: "Category removed successfully",
      });
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteAlert({ isOpen: true, id });
  };

  const filteredCategories = categories.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">
            Category Taxonomy.
          </h1>
          <p className="text-[#0B1221]/40 text-sm font-medium">
            Organize your products into meaningful groupings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm ${
              isReorderMode
                ? "bg-amber-500 text-white shadow-amber-500/20"
                : "bg-white text-[#0B1221] border border-black/5 hover:bg-gray-50"
            }`}
          >
            <Move size={18} />
            <span>{isReorderMode ? "Exit Reordering" : "Manage Order"}</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0B1221] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isReorderMode && (
          <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex items-center px-8">
            <button
              onClick={handleReorderSave}
              disabled={isSavingOrder}
              className="flex items-center gap-3 bg-[#0B1221] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
            >
              {isSavingOrder ? (
                <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse border border-white/10" />
              ) : (
                "Save New Order"
              )}
            </button>
          </div>
        )}
      </div>

      {isReorderMode ? (
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Drag and Drop to Reorder
            </h3>
            <p className="text-xs text-[#0B1221]/40 font-medium">
              Position your key categories at the top. This order affects the
              Header and Homepage explore section.
            </p>
          </div>
          <Reorder.Group
            axis="y"
            values={orderList}
            onReorder={setOrderList}
            className="space-y-4"
          >
            {orderList.map((category) => (
              <Reorder.Item
                key={category._id || category.id}
                value={category}
                className="flex items-center gap-6 p-6 bg-gray-50 border border-black/5 rounded-3xl cursor-grab active:cursor-grabbing hover:border-blue-500/30 transition-colors group"
              >
                <div className="p-3 bg-white rounded-xl text-black/10 group-hover:text-blue-600 transition-colors shadow-sm">
                  <GripVertical size={20} />
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
                  {category.image ? (
                    <img
                      src={resolveImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/5">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-[#0B1221] tracking-tight">
                    {category.name}
                  </h4>
                  <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest mt-0.5">
                    Slug: {category.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  {category.showInHeader && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      Header
                    </span>
                  )}
                  {category.showInExplore && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      Explore
                    </span>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))
            : filteredCategories.map((category: any) => (
                <div
                  key={category.id || category._id}
                  className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-black/5">
                      {category.image ? (
                        <img
                          src={resolveImageUrl(category.image)}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/10">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-blue-600 transition-colors shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category.id || category._id)
                        }
                        className="p-3 bg-white border border-black/5 rounded-xl text-black/20 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#0B1221] tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest mt-1 mb-6">
                    Slug: {category.slug}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full ${category.status === "active" ? "text-emerald-500" : "text-gray-400"}`}
                    >
                      {category.status}
                    </span>
                    {category.isFeatured && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        Featured
                      </span>
                    )}
                    {category.showPoster && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                        Poster Enabled
                      </span>
                    )}
                    {category.showInExplore && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                        Explore Section
                      </span>
                    )}
                    {category.showInHeader && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        Header Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
        </div>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Refine Collection." : "Forge New Category."}
        subtitle="Configure your product taxonomy and presentation."
        footer={
          <button
            type="submit"
            form="category-form"
            disabled={loading}
            className="w-full bg-[#0B1221] text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : editingCategory ? (
              "Update Collection Details"
            ) : (
              "Establish New Collection"
            )}
          </button>
        }
      >
        <form onSubmit={handleSubmit} id="category-form" className="space-y-10">
          {/* Section: Core Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-blue-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                Core Identity
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                  placeholder="e.g. Modern Classics"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  URL Identifier (Slug)
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                  placeholder="e.g. modern-classics"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 p-5 bg-blue-50/30 border border-blue-500/10 rounded-2xl">
              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-black/5 flex-shrink-0 relative group shadow-sm">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/5">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-[#0B1221] uppercase tracking-wider">
                  Category Icon
                </p>
                <p className="text-[10px] text-[#0B1221]/40 font-medium mt-0.5">
                  Primary classification image. Suggested: 400x400 PNG.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Promotional Banner */}
          <div className="space-y-6 pt-6 border-t border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-indigo-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                Promotional Banner
              </h3>
            </div>

            <div className="flex items-center justify-between p-5 bg-indigo-50/30 border border-indigo-500/10 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#0B1221] uppercase tracking-wide italic">
                  Activate Visual Billboard
                </span>
                <span className="text-[9px] text-[#0B1221]/40 font-black uppercase tracking-widest mt-0.5">
                  Feature this collection with a wide-screen banner
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="showBanner"
                  checked={formData.showBanner}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formData.showBanner && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      Banner Main Title
                    </label>
                    <input
                      type="text"
                      name="bannerTitle"
                      value={formData.bannerTitle}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                      placeholder="e.g. Elevate Your Style."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                        Banner Subtitle
                      </label>
                      <input
                        type="text"
                        name="bannerSubtitle"
                        value={formData.bannerSubtitle}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                        placeholder="e.g. Premium Selection"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                        Banner Description
                      </label>
                      <input
                        type="text"
                        name="bannerDescription"
                        value={formData.bannerDescription}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                        placeholder="e.g. Exclusively Crafted"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-5 bg-white border border-black/5 rounded-2xl shadow-sm">
                  <div className="w-32 h-20 bg-gray-50 rounded-xl overflow-hidden border border-black/5 flex-shrink-0 relative group">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/5">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <input
                      type="file"
                      name="bannerImage"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-[#0B1221] uppercase tracking-wider">
                      Wide Background Background
                    </p>
                    <p className="text-[10px] text-[#0B1221]/40 font-medium mt-0.5">
                      Suggested: 21:9 Aspect Ratio (2000x850px).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Visibility Settings */}
          <div className="space-y-6 pt-6 border-t border-black/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-emerald-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                Site Integration
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "isFeatured", label: "Featured Status", color: "blue" },
                { name: "showInExplore", label: "Home Grid", color: "emerald" },
                { name: "showInHeader", label: "Top Menu", color: "blue" },
              ].map((toggle) => (
                <div
                  key={toggle.name}
                  className="flex flex-col gap-3 p-4 bg-gray-50 border border-black/5 rounded-xl"
                >
                  <span className="text-[10px] font-black text-[#0B1221] uppercase tracking-wider text-center">
                    {toggle.label}
                  </span>
                  <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name={toggle.name}
                        checked={(formData as any)[toggle.name]}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-${toggle.color === "blue" ? "blue-600" : "emerald-600"}`}
                      ></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </AdminModal>

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Category"
        message="Are you sure? This will affect all products within this category."
        type="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
      />
    </div>
  );
}
