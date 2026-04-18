"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { OrderDetailModal } from "@/components/profile/OrderDetailModal";
import { BackButton } from "@/components/common/BackButton";
import { useEffect, useState } from "react";
import { ChevronRight, Package, Calendar, Tag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyOrdersQuery } from "@/src/store/api/orderApi";
import { resolveImageUrl } from "@/src/utils/image";

export default function MyOrdersPage() {
  const { data: rawOrders = [], isLoading } = useGetMyOrdersQuery({});
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize orders for the UI
  const orders = rawOrders.map((order: any) => ({
    ...order,
    id: order.orderId || order._id,
    date: order.createdAt,
    total: order.totalPrice,
    shippingAddress:
      typeof order.shippingAddress === "object"
        ? `${order.shippingAddress.street}, ${order.shippingAddress.city}`
        : order.shippingAddress,
  }));

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32 lg:pt-10">
      {/* 1. Orders Hero */}
      <div className="relative h-[20vh] lg:h-[30vh]  flex lg:hidden items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Order History
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            My Orders.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              Track and manage your orders
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start relative">
          <ProfileSidebar />

          <div className="flex-1 w-full relative space-y-12">
            <div className="flex items-center justify-between mb-8">
              <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
                  Total Orders: {orders.length}
                </p>
              </div>
            </div>

            {/* Redesigned Order Cards (Mobile/Tablet) */}
            <div className="lg:hidden space-y-6">
              {orders.map((order: any, idx: number) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="group relative glass-card p-6 bg-white border border-black/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.3em]">
                        Order ID
                      </span>
                      <h3 className="text-sm font-black text-[#0B1221] tracking-tight">
                        {order.id}
                      </h3>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 py-6 border-y border-black/5">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.3em]">
                        Order Date
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-blue-600" />
                        <span className="text-xs font-bold text-[#0B1221]">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.3em]">
                        Total Amount
                      </span>
                      <p className="text-sm font-black text-blue-600">
                        ৳{order.total}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {order.items?.slice(0, 3).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-50 relative group-hover:scale-110 transition-transform duration-500"
                        >
                          <Image
                            src={resolveImageUrl(
                              item.image ||
                                item.product?.image ||
                                "/placeholder.jpg"
                            )}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0B1221] flex items-center justify-center text-[10px] font-black text-white">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 group/btn">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#0B1221]/40 group-hover/btn:text-blue-600 transition-colors">
                        Details
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-[#0B1221]/10 group-hover/btn:text-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Order Table View */}
            <div className="hidden lg:block glass-card rounded-[3rem] border border-black/5 bg-white overflow-hidden shadow-2xl shadow-black/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-gray-50/30">
                    <th className="px-10 py-8 text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                      Order ID
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                      Order Date
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                      Total Amount
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                      Payment
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em] text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {orders.map((order: any, idx: number) => (
                    <tr
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="group hover:bg-blue-600/5 cursor-pointer transition-all duration-500"
                    >
                      <td className="px-10 py-8">
                        <span className="text-sm font-black text-[#0B1221] group-hover:text-blue-600 transition-colors">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-xs font-bold text-[#0B1221]/60">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-sm font-black text-[#0B1221]">
                          ৳{order.total}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <CreditCard
                            size={14}
                            className="text-blue-600/40"
                            strokeWidth={1.5}
                          />
                          <span className="text-xs font-bold text-[#0B1221]/60">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <span
                          className={`inline-flex items-center px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 group-hover:px-7 ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {!isLoading && orders.length === 0 && (
              <div className="text-center py-40 glass-card rounded-[3.5rem] bg-white border border-black/5">
                <Package
                  size={64}
                  className="mx-auto mb-8 text-[#0B1221]/10"
                  strokeWidth={1}
                />
                <h3 className="hero-display text-3xl tracking-tighter text-[#0B1221] mb-2 uppercase">
                  No Orders Found
                </h3>
                <p className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest">
                  You haven&apos;t placed any orders yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
