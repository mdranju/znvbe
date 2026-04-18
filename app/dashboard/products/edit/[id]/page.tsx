"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, ImageIcon, Type } from "lucide-react";
import Link from "next/link";
import adminAxiosInstance from "@/src/services/adminAxiosInstance";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { resolveImageUrl } from "@/src/utils/image";
import { SizeManager } from "@/components/dashboard/SizeManager";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";

import {
  useGetAdminProductByIdQuery,
  useGetAllAdminCategoriesQuery,
  useUpdateAdminProductMutation,
  useGetAllAdminSubcategoriesQuery,
} from "@/src/store/api/adminApi";
import { FormSkeleton } from "@/components/ui/SkeletonComponents";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // RTK Query hooks
  const { data: productData, isLoading: isProductLoading } =
    useGetAdminProductByIdQuery(id as string);
  const { data: categoriesData } = useGetAllAdminCategoriesQuery({});
  const { data: subcategoriesData } = useGetAllAdminSubcategoriesQuery({});
  const [updateProduct] = useUpdateAdminProductMutation();

  const product = productData?.data || productData;
  const categories = categoriesData?.data || categoriesData || [];
  const allSubcategories = subcategoriesData?.data || subcategoriesData || [];
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    subcategory: "",
    status: "active",
    isFeatured: false,
    badge: "",
    sizes: [] as { name: string; stock: number; sku?: string }[],
    colors: [] as string[],
    details: [] as { name: string; value: string }[],
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [reorderedItems, setReorderedItems] = useState<any[]>([]);

  const [newColor, setNewColor] = useState("");
  const [newDetail, setNewDetail] = useState({ name: "", value: "" });

  // Sync form data when product data is fetched
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category?._id || product.category || "",
        subcategory: product.subcategory?._id || product.subcategory || "",
        status: product.status || "active",
        isFeatured: product.isFeatured || false,
        badge: product.badge || "",
        sizes:
          product.sizes &&
          product.sizes.length > 0 &&
          typeof product.sizes[0] === "string"
            ? product.sizes.map((s: string) => ({ name: s, stock: 0 }))
            : product.sizes || [],
        colors: product.colors || [],
        details: product.details || [],
      });

      if (product.images) {
        setExistingImages(product.images);
      }
    }
  }, [product]);

  useEffect(() => {
    if (formData.category) {
      const filtered = allSubcategories.filter(
        (sub: any) =>
          (sub.category?._id || sub.category?.id || sub.category) ===
          formData.category,
      );
      setSubcategories(filtered);
    } else {
      setSubcategories([]);
    }
  }, [formData.category, allSubcategories]);

  // Sync total stock calculation when sizes change
  useEffect(() => {
    if (formData.sizes.length > 0) {
      const totalStock = formData.sizes.reduce(
        (acc, size) => acc + (Number(size.stock) || 0),
        0
      );
      setFormData((prev) => ({ ...prev, stock: totalStock.toString() }));
    }
  }, [formData.sizes]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const addDetail = () => {
    if (newDetail.name && newDetail.value) {
      setFormData((prev) => ({
        ...prev,
        details: [...prev.details, newDetail],
      }));
      setNewDetail({ name: "", value: "" });
    }
  };

  const removeDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "details" || key === "sizes") {
          data.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v as any));
        } else {
          data.append(key, value.toString());
        }
      });

      // If we have reordered items, use that order for both existing and new
      if (reorderedItems.length > 0) {
        const orderExisting = reorderedItems
          .filter(item => item.type === "existing")
          .map(item => item.original); 
        
        data.append("existingImages", JSON.stringify(orderExisting));

        reorderedItems
          .filter(item => item.type === "new")
          .forEach(item => {
            data.append("image", item.file);
          });
      } else {
        // Fallback to original behavior
        data.append("existingImages", JSON.stringify(existingImages));
        newImages.forEach((image) => {
          data.append("image", image);
        });
      }

      await updateProduct({ id: id as string, data }).unwrap();

      toast.success("Success", {
        description: "Product updated successfully!",
      });
      router.push("/dashboard/products");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessages?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to update product";
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (isProductLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-full mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/products"
            className="w-12 h-12 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-[#0B1221]/40 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-1">
              Edit Masterpiece.
            </h1>
            <p className="text-[#0B1221]/40 text-sm font-medium">
              Refine your collection's finest details.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Basic Information
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm"
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
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40">
                    Full Description
                  </label>
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                    <Type size={10} className="text-blue-600" />
                    <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider">Rich Text</span>
                  </div>
                </div>
                <RichTextEditor 
                  content={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                  placeholder="Describe your product in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Regular Price (৳)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Old Price (Optional)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40">
                      Stock Level
                    </label>
                    {formData.sizes.length > 0 && (
                      <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">Auto-calculated</span>
                    )}
                  </div>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleInputChange}
                    readOnly={formData.sizes.length > 0}
                    placeholder={formData.sizes.length > 0 ? "Calculated from sizes..." : "50"}
                    className={`w-full px-6 py-4 border border-black/5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-sm ${formData.sizes.length > 0 ? "bg-blue-50/50 text-blue-600 font-bold" : "bg-gray-50"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Variants & Attributes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <SizeManager
                sizes={formData.sizes}
                onSizesChange={(newSizes) =>
                  setFormData((prev) => ({ ...prev, sizes: newSizes }))
                }
              />

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Available Colors
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="flex-1 px-5 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-[#0B1221] transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-black/5 rounded-xl text-xs font-bold text-[#0B1221]"
                    >
                      {color}
                      <X
                        size={14}
                        className="cursor-pointer text-[#0B1221]/20 hover:text-red-500"
                        onClick={() => removeColor(color)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Technical Specifications
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Label (e.g. Material)
                  </label>
                  <input
                    type="text"
                    value={newDetail.name}
                    onChange={(e) =>
                      setNewDetail((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Material"
                    className="w-full px-5 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Value (e.g. 100% Cotton)
                  </label>
                  <input
                    type="text"
                    value={newDetail.value}
                    onChange={(e) =>
                      setNewDetail((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="100% Cotton"
                    className="w-full px-5 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={addDetail}
                  className="h-[52px] px-8 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-[#0B1221] transition-all shadow-lg shadow-blue-500/10"
                >
                  Add Spec
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-black/5 rounded-2xl group"
                  >
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {detail.name}
                      </p>
                      <p className="text-xs font-bold text-[#0B1221]">
                        {detail.value}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDetail(idx)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-black/5 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Media Library
            </h3>
            <ImageUpload
              existingImages={existingImages}
              newImages={newImages}
              onRemoveExisting={(url) => {
                setExistingImages((prev) =>
                  prev.filter((img) => resolveImageUrl(img) !== url),
                );
                setReorderedItems(prev => prev.filter(i => i.url !== url));
              }}
              onAddNewImages={(files) =>
                setNewImages((prev) => [...prev, ...files])
              }
              onRemoveNew={(index) => {
                const file = newImages[index];
                setNewImages((prev) => prev.filter((_, i) => i !== index));
                setReorderedItems(prev => prev.filter(i => i.file !== file));
              }}
              onReorder={(items) => setReorderedItems(items)}
            />
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-black/5 shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              Organization
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  Category
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  disabled={!formData.category}
                  className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select a subcategory (Optional)</option>
                  {subcategories.map((sub: any) => (
                    <option key={sub.id || sub._id} value={sub.id || sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Visibility Status
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-bold text-[#0B1221]">
                  Featured Product
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1221] text-white h-16 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
