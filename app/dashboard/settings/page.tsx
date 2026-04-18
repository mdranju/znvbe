"use client";

import { useEffect, useState } from "react";
import { FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { resolveImageUrl } from "@/src/utils/image";
import {
  Facebook,
  Globe,
  ImageIcon,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "@/src/store/api/adminApi";
import { SettingsSkeleton } from "@/components/ui/SkeletonComponents";

export default function CMSUserSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  // RTK Query hooks
  const { data: settingsData, isLoading: isFetching } =
    useGetAdminSettingsQuery();
  const [updateSettings] = useUpdateAdminSettingsMutation();

  const settings = settingsData?.data || settingsData;

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    youtube: "",
    tiktok: "",
    twitter: "",
  });

  const [previews, setPreviews] = useState({
    headerLogo: "",
    footerLogo: "",
    dashboardLogo: "",
  });

  // Sync form data when settings are fetched
  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        whatsapp: settings.whatsapp || "",
        youtube: settings.youtube || "",
        tiktok: settings.tiktok || "",
        twitter: settings.twitter || "",
      });
      setPreviews({
        headerLogo: resolveImageUrl(settings.headerLogo?.url || ""),
        footerLogo: resolveImageUrl(settings.footerLogo?.url || ""),
        dashboardLogo: resolveImageUrl(settings.dashboardLogo?.url || ""),
      });
    }
  }, [settings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [logoFiles, setLogoFiles] = useState<{
    headerLogo: File | null;
    footerLogo: File | null;
    dashboardLogo: File | null;
  }>({
    headerLogo: null,
    footerLogo: null,
    dashboardLogo: null,
  });

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFiles((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value),
      );

      if (logoFiles.headerLogo) data.append("headerLogo", logoFiles.headerLogo);
      if (logoFiles.footerLogo) data.append("footerLogo", logoFiles.footerLogo);
      if (logoFiles.dashboardLogo)
        data.append("dashboardLogo", logoFiles.dashboardLogo);

      await updateSettings(data).unwrap();

      toast.success("Saved", {
        description: "CMS settings updated successfully",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessages?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to save settings";
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="max-w-full mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">
          CMS Core Settings.
        </h1>
        <p className="text-[#0B1221]/40 text-sm font-medium">
          Configure global elements and branding assets.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 flex flex-col gap-2">
          {[
            { id: "general", label: "General", icon: Globe },
            { id: "contact", label: "Contact Info", icon: Phone },
            { id: "social", label: "Social Links", icon: Facebook },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id
                  ? "bg-[#0B1221] text-white shadow-xl"
                  : "text-black/40 hover:bg-white hover:text-[#0B1221]"
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-sm min-h-[600px] flex flex-col">
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black text-[#0B1221]">
                  Brand Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Header Logo */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      Header Logo
                    </label>
                    <div className="p-6 bg-gray-50 border border-black/5 rounded-[2.5rem] flex flex-col items-center gap-4 group">
                      <div className="w-full aspect-video bg-white rounded-2xl border border-black/5 flex items-center justify-center relative overflow-hidden">
                        {previews.headerLogo ? (
                          <img
                            src={previews.headerLogo}
                            alt="Header Logo"
                            className="max-w-[70%] max-h-[70%] object-contain"
                          />
                        ) : (
                          <ImageIcon size={32} className="text-black/5" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleLogoChange(e, "headerLogo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-[#0B1221]/40 uppercase">
                        Click to change
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Logo */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      Dashboard Logo
                    </label>
                    <div className="p-6 bg-gray-50 border border-black/5 rounded-[2.5rem] flex flex-col items-center gap-4">
                      <div className="w-full aspect-video bg-white rounded-2xl border border-black/5 flex items-center justify-center relative overflow-hidden">
                        {previews.dashboardLogo ? (
                          <img
                            src={previews.dashboardLogo}
                            alt="Dashboard Logo"
                            className="max-w-[70%] max-h-[70%] object-contain"
                          />
                        ) : (
                          <ImageIcon size={32} className="text-black/5" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleLogoChange(e, "dashboardLogo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-[#0B1221]/40 uppercase">
                        Click to change
                      </p>
                    </div>
                  </div>

                  {/* Footer Logo */}
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      Footer Logo
                    </label>
                    <div className="p-8 bg-gray-900 border border-black/5 rounded-[2.5rem] flex items-center gap-10">
                      <div className="w-40 aspect-video bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                        {previews.footerLogo ? (
                          <img
                            src={previews.footerLogo}
                            alt="Footer Logo"
                            className="max-w-[70%] max-h-[70%] object-contain brightness-0 invert"
                          />
                        ) : (
                          <ImageIcon size={32} className="text-white/5" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleLogoChange(e, "footerLogo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white mb-2">
                          Footer Branding
                        </p>
                        <p className="text-xs text-white/40 leading-relaxed max-w-sm">
                          This logo will appear in the footer section. We
                          recommend using a white/monochrome version for dark
                          backgrounds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black text-[#0B1221]">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      <Phone size={12} /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      <Mail size={12} /> Support Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-4">
                      <MapPin size={12} /> Physical Address (Footer)
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black text-[#0B1221]">
                  Social Connectivity
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Facebook size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-2">
                        Facebook Page Link
                      </label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        className="w-full px-6 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Instagram size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-2">
                        Instagram Profile Link
                      </label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full px-6 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FaYoutube size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-2">
                        YouTube Channel Link
                      </label>
                      <input
                        type="text"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleInputChange}
                        className="w-full px-6 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FaTiktok size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-2">
                        TikTok Profile Link
                      </label>
                      <input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleInputChange}
                        className="w-full px-6 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FaXTwitter size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 ml-2">
                        Twitter Profile Link
                      </label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full px-6 py-3 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-10 border-t border-black/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-12 bg-[#0B1221] text-white h-16 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Sync Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
