"use client";

import { useEffect, useState } from "react";
import { Search, Eye, ShoppingBag, Clock, CheckCircle, Package, XCircle, ChevronRight, Truck } from "lucide-react";
import adminAxiosInstance from "@/src/services/adminAxiosInstance";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getProductImage } from "@/src/utils/image";

import { TableRowSkeleton } from "@/components/ui/SkeletonComponents";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAxiosInstance.get("/order");
      setOrders(response.data.data);
    } catch (error: any) {
      toast.error("Error", { description: "Failed to fetch orders" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminAxiosInstance.patch(`/order/update-status/${id}`, { status });
      toast.success("Updated", { description: `Order status changed to ${status}` });
      if (selectedOrder && (selectedOrder._id === id || selectedOrder.id === id)) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      fetchOrders();
    } catch (error: any) {
      toast.error("Error", { description: "Failed to update status" });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.shippingAddress?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'confirmed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-indigo-500" />;
      case 'delivered': return <Package size={16} className="text-emerald-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 ring-amber-600/10';
      case 'confirmed': return 'bg-blue-50 text-blue-600 ring-blue-600/10';
      case 'shipped': return 'bg-indigo-50 text-indigo-600 ring-indigo-600/10';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 ring-emerald-600/10';
      case 'cancelled': return 'bg-red-50 text-red-600 ring-red-600/10';
      default: return 'bg-gray-50 text-gray-600 ring-gray-600/10';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#0B1221] tracking-tight mb-2">Order Fullfillment.</h1>
        <p className="text-[#0B1221]/40 text-sm font-medium">Manage customer purchases and logistical statuses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button 
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-6 rounded-3xl border transition-all text-left group ${statusFilter === s ? 'bg-[#0B1221] border-[#0B1221] text-white shadow-xl' : 'bg-white border-black/5 text-[#0B1221] hover:border-blue-200'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${statusFilter === s ? 'bg-white/10' : 'bg-gray-50'}`}>
              {getStatusIcon(s)}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === s ? 'text-white/40' : 'text-black/20'}`}>{s}</p>
            <p className="text-xl font-black">{orders.filter(o => o.status === s).length}</p>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer Name..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setStatusFilter("all")}
          className="px-6 py-4 bg-white border border-black/5 rounded-xl font-bold text-xs uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all"
        >
          Reset Filters
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Order Info</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Customer</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Total Amount</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <TableRowSkeleton key={i} columns={5} />)
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-[#0B1221]">
                        {order.orderId || "LEGACY"}
                      </p>
                      <p className="text-[10px] text-[#0B1221]/40 font-bold uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-[#0B1221]">
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </p>
                      <p className="text-[10px] text-[#0B1221]/40">
                        {order.shippingAddress?.email} •{" "}
                        {order.shippingAddress?.phone}
                      </p>
                    </td>
                    <td className="px-6 py-6 font-black text-[#0B1221]">
                      ৳{order.totalPrice}
                    </td>
                    <td className="px-6 py-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            order._id || order.id,
                            e.target.value
                          )
                        }
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full ring-1 outline-none cursor-pointer transition-all ${getStatusStyles(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-white border border-black/5 text-black/20 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-[#0B1221]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-10 lg:p-12 space-y-12 pb-32">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                  <XCircle size={24} className="text-black/20" />
                </button>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full ring-1 ${getStatusStyles(selectedOrder.status)}`}>
                        {selectedOrder.status}
                    </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Detailed View</p>
                <h2 className="text-4xl font-black text-[#0B1221] tracking-tighter">Order {selectedOrder.orderId}</h2>
                <p className="text-xs text-[#0B1221]/40 font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-black/5">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Customer & Shipping</h4>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-[#0B1221]">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                        <p className="text-xs text-[#0B1221]/60 font-medium">{selectedOrder.shippingAddress?.email}</p>
                        <p className="text-xs text-[#0B1221]/60 font-medium">{selectedOrder.shippingAddress?.phone}</p>
                        <p className="text-xs text-[#0B1221]/60 font-medium mt-2">
                            {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}<br />
                            {selectedOrder.shippingAddress?.district}
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Payment Info</h4>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-[#0B1221] uppercase">{selectedOrder.paymentMethod}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full ${selectedOrder.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {selectedOrder.paymentStatus}
                        </span>
                        {selectedOrder.notes && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 italic text-xs text-amber-900">
                                "{selectedOrder.notes}"
                            </div>
                        )}
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">Order Composition</h4>
                <div className="divide-y divide-black/5 border border-black/5 rounded-3xl overflow-hidden bg-gray-50/50">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-6 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-black/5 shrink-0 relative">
                                <OptimizedImage 
                                    src={getProductImage(item.product)} 
                                    alt={item.name} 
                                    fill 
                                    context="thumbnail"
                                    className="object-cover" 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-[#0B1221] truncate uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-widest mt-1">
                                    SKU: {item.sku || "N/A"} • {item.size} • {item.color || "None"} • ৳{item.price} x {item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-black text-[#0B1221]">৳{item.price * item.quantity}</p>
                        </div>
                    ))}
                    <div className="p-8 bg-[#0B1221]/5 space-y-3">
                        <div className="flex justify-between text-[11px] font-bold text-[#0B1221]/40 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>৳{selectedOrder.totalPrice - selectedOrder.shippingCost}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-[#0B1221]/40 uppercase tracking-widest">
                            <span>Shipping Cost</span>
                            <span>৳{selectedOrder.shippingCost}</span>
                        </div>
                        <div className="pt-4 border-t border-black/10 flex justify-between text-lg font-black text-[#0B1221]">
                            <span>Grand Total</span>
                            <span>৳{selectedOrder.totalPrice}</span>
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-10">
                <p className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.4em] text-center">
                    ZNVBE Logistics Architecture <br /> Secure Fulfillment Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

