"use client";

import { useState, useEffect } from "react";
import { Search, Users, User, Shield, Calendar, Phone, Mail, X, MapPin } from "lucide-react";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { resolveImageUrl } from "@/src/utils/image";
import { 
  useGetAllAdminUsersQuery, 
  useToggleAdminUserBlockMutation 
} from "@/src/store/api/adminApi";
import { Pagination } from "@/components/dashboard/Pagination";
import { UserCardSkeleton } from "@/components/ui/SkeletonComponents";

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // RTK Query hook with pagination
  const { data: usersResponse, isLoading } = useGetAllAdminUsersQuery({
    page,
    limit: 12,
  });

  const [toggleBlock, { isLoading: isBlocking }] = useToggleAdminUserBlockMutation();

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { page: 1, totalPages: 1, total: 0 };

  const handleToggleBlock = async (id: string) => {
    try {
      await toggleBlock(id).unwrap();
      toast.success("Success", { description: "User status updated successfully." });
    } catch (error) {
      toast.error("Error", { description: "Failed to update user status." });
    }
  };

  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contactNumber?.includes(searchTerm)
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">User Directory.</h1>
          <p className="text-[#0B1221]/40 text-sm font-medium">Manage your community and administrative personnel.</p>
        </div>
        <div className="bg-blue-600/5 px-6 py-3 rounded-2xl border border-blue-600/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Total Users</p>
          <p className="text-2xl font-black text-[#0B1221]">{meta.total}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text" 
            placeholder="Search on this page..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 border border-black/5 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-black/10">
            <Users size={40} />
          </div>
          <h3 className="text-xl font-bold text-[#0B1221]">No Users Found</h3>
          <p className="text-sm text-[#0B1221]/40 mt-2">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user: any) => (
              <div key={user._id || user.id} className={`bg-white p-8 rounded-[3rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative ${user.status === 'blocked' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none ${user.status === 'blocked' ? 'bg-red-500/10' : 'bg-blue-500/5'}`} />
                
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/50">
                    {user.image ? (
                      <img src={resolveImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <User size={24} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-[#0B1221] tracking-tight truncate max-w-[150px]">{user.name}</h3>
                      {user.role === 'ADMIN' && <Shield size={14} className="text-amber-500" />}
                      {user.role === 'SUPER_ADMIN' && <Shield size={14} className="text-red-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest leading-none">{user.role}</p>
                       {user.status === 'blocked' && (
                         <span className="text-[8px] font-black uppercase text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Blocked</span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-black/5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-black/20"><Mail size={14} /></div>
                    <p className="text-xs font-bold text-[#0B1221] truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-black/20"><Phone size={14} /></div>
                    <p className="text-xs font-bold text-[#0B1221]">{user.contactNumber || "No contact info"}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 relative z-10">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 px-4 py-4 bg-[#0B1221] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    Full Profile
                  </button>
                  {(user.role !== 'SUPER_ADMIN') && (
                    <button 
                      onClick={() => handleToggleBlock(user._id || user.id)}
                      disabled={isBlocking}
                      className={`p-4 rounded-2xl border transition-all active:scale-95 ${
                        user.status === 'blocked'
                          ? "bg-red-500 text-white border-red-600"
                          : "bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      < Shield size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Pagination 
            currentPage={page} 
            totalPages={meta.totalPages} 
            onPageChange={setPage} 
          />
        </>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0B1221]/80 backdrop-blur-md"
            onClick={() => setSelectedUser(null)}
          />
          <div className="bg-white w-full max-w-xl rounded-[3rem] relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-12 space-y-10">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100 shadow-inner">
                  {selectedUser.image ? (
                    <img src={resolveImageUrl(selectedUser.image)} alt={selectedUser.name} className="w-full h-full object-cover rounded-[2rem]" />
                  ) : (
                    <User size={40} className="text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-[#0B1221] tracking-tight">{selectedUser.name}</h2>
                    {selectedUser.role !== 'USER' && <Shield size={20} className="text-amber-500" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white px-3 py-1 rounded-full">
                      {selectedUser.role}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                      selectedUser.status === 'blocked' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                    }`}>
                      {selectedUser.status === 'blocked' ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</p>
                  <p className="text-xs font-bold text-[#0B1221] break-words">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</p>
                  <p className="text-xs font-bold text-[#0B1221]">{selectedUser.contactNumber || "N/A"}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Member Since</p>
                  <p className="text-xs font-bold text-[#0B1221]">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-black/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Verified Status</p>
                  <p className="text-xs font-bold text-[#0B1221]">{selectedUser.verified ? "Verified Account" : "Unverified Account"}</p>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-black transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-white/50 group-hover:text-blue-400 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Primary Address</p>
                    <p className="text-xs font-bold text-white group-hover:text-blue-50">{selectedUser.address || "No address provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
