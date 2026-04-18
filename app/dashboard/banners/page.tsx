"use client";

import { CustomAlert } from "@/components/ui/CustomAlert";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { BannerSkeleton } from "@/components/ui/SkeletonComponents";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllAdminBannersQuery,
  useReorderBannersMutation,
  useUpdateBannerMutation,
} from "@/src/store/api/adminApi";
import { resolveImageUrl } from "@/src/utils/image";
import { Reorder } from "framer-motion";
import {
  Check,
  Edit2,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Move,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function BannerManagementPage() {
  const { data: bannerData, isLoading: loading } = useGetAllAdminBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBannerMutation, { isLoading: isUpdating }] =
    useUpdateBannerMutation();
  const [deleteBannerMutation] = useDeleteBannerMutation();
  const [reorderBanners, { isLoading: isSavingOrder }] =
    useReorderBannersMutation();

  const [banners, setBanners] = useState<any[]>([]);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    type: "hero",
    status: "active",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const data = bannerData?.data || bannerData || [];
    if (Array.isArray(data)) {
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(sorted);
      setOrderList(sorted);
    }
  }, [bannerData]);

  const handleSaveOrder = async () => {
    try {
      const payload = orderList.map((item, index) => ({
        id: item._id || item.id,
        order: index,
      }));
      await reorderBanners(payload).unwrap();
      toast.success("Success", {
        description: "Banner exhibition sequence updated",
      });
      setIsReorderMode(false);
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to update sequence",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      type: "hero",
      status: "active",
    });
    setImage(null);
    setPreview("");
    setEditingBanner(null);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      type: banner.type || "hero",
      status: banner.status || "active",
    });
    setPreview(resolveImageUrl(banner.image));
    setImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBannerMutation(id).unwrap();
      toast.success("Success", {
        description: "Banner removed from exhibition",
      });
      setDeleteAlert({ isOpen: false, id: null });
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      if (editingBanner) {
        await updateBannerMutation({
          id: editingBanner._id || editingBanner.id,
          data,
        }).unwrap();
        toast.success("Success", {
          description: "Banner updated successfully",
        });
      } else {
        await createBanner(data).unwrap();
        toast.success("Success", {
          description: "Banner created successfully",
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#0B1221] tracking-tight">
            Banner Layouts.
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Manage your storefront hero and promotional banners
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isReorderMode
                ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20"
                : "bg-white text-[#0B1221] border border-black/5 hover:bg-gray-50"
            }`}
          >
            <Move size={16} />
            {isReorderMode ? "Exit Organizing" : "Manage Order"}
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0B1221] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-black/5"
          >
            <Plus size={16} />
            Add Banner
          </button>
        </div>
      </div>

      {isReorderMode ? (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
                Restructure Exhibition Order
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Drag and drop items to define their display sequence on the
                storefront.
              </p>
            </div>
            <button
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="flex items-center gap-2 bg-[#0B1221] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-black/10 disabled:opacity-50"
            >
              {isSavingOrder ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Check size={18} />
              )}
              Save New Layout
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={orderList}
            onReorder={setOrderList}
            className="space-y-4"
          >
            {orderList.map((banner, index) => (
              <Reorder.Item
                key={banner._id || banner.id}
                value={banner}
                className="flex items-center gap-6 p-6 bg-gray-50 border border-black/5 rounded-[2rem] cursor-grab active:cursor-grabbing hover:border-blue-500/30 transition-colors group"
              >
                <div className="p-3 bg-white rounded-xl text-black/10 group-hover:text-blue-600 transition-colors shadow-sm">
                  <GripVertical size={20} />
                </div>
                <div className="w-24 h-14 bg-white rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                  <img
                    src={resolveImageUrl(banner.image)}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-600">
                      #{index + 1}
                    </span>
                    <h4 className="text-sm font-black text-[#0B1221] uppercase tracking-tight">
                      {banner.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    Type: {banner.type} • Status: {banner.status}
                  </p>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <BannerSkeleton key={i} />)
          ) : banners.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100 italic">
              <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400">No banners found</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div
                key={banner._id || banner.id}
                className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Banner Preview */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={resolveImageUrl(banner.image)}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-3 bg-white rounded-xl text-[#0B1221] hover:bg-[#0B1221] hover:text-white transition-all shadow-xl"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteAlert({
                          isOpen: true,
                          id: banner._id || banner.id,
                        })
                      }
                      className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 bg-[#0B1221] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg border border-white/10">
                      {banner.type}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-lg font-black text-[#0B1221] mb-2 truncate uppercase tracking-tight">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium line-clamp-2 min-h-[40px] leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${banner.status === "active" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-gray-300"}`}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {banner.status}
                      </span>
                    </div>
                    <a
                      href={banner.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0B1221]/80  backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] border border-white/10">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-[#0B1221] tracking-tight uppercase">
                    {editingBanner ? "Refine Banner." : "Forge Banner."}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Configure your storefront visual assets.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 text-gray-400 hover:text-[#0B1221] hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Area */}
                <div className="relative h-64 bg-gray-50 rounded-3xl border-2 border-dashed border-black/5 flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-blue-500/30">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-[#0B1221] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                          Change Visual
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/5 border border-black/5">
                        <Plus className="text-blue-600" size={24} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Upload Asset
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="absolute inset-0 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm"
                      placeholder="Enter banner title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Category Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm"
                    >
                      <option value="hero">Hero Main</option>
                      <option value="cta">CTA Section</option>
                      <option value="poster">Poster Style</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm"
                    placeholder="Enter subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm min-h-[100px]"
                    placeholder="Describe the promotion..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Action Text
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaText: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm"
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Action URL
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaLink: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-black/5 focus:bg-white focus:ring-4 ring-blue-500/5 font-bold outline-none transition-all text-sm"
                      placeholder="/products/all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all shadow-sm"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-[#0B1221] text-white hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-black/10"
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Synchronizing...
                      </>
                    ) : editingBanner ? (
                      "Update Assets"
                    ) : (
                      "Deploy Banner"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
        onConfirm={() => {
          if (deleteAlert.id) {
            handleDelete(deleteAlert.id);
          }
        }}
        title="Delete Visual Asset"
        message="This will permanently remove this banner from your exhibition. Are you sure you wish to proceed?"
        type="danger"
        confirmText="Confirm Deletion"
      />
    </div>
  );
}
