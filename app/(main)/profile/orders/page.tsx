"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { OrderDetailModal } from "@/components/profile/OrderDetailModal";
import { BackButton } from "@/components/common/BackButton";
import { mockOrders } from "@/lib/data";
import { useState } from "react";
import { ChevronRight, Package, Calendar, Tag, CreditCard } from "lucide-react";

interface IOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }>;
}

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        <ProfileSidebar />

        <div className="flex-1 w-full relative">
          <BackButton className="mb-" />
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-blue-600" />
            My Orders
          </h1>

          {/* Mobile Card List (Hidden on LG) */}
          <div className="lg:hidden space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Order ID
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {order.id}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        Date
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right justify-end">
                    <div>
                      <span className="text-[10px] text-gray-400 block text-right">
                        Total Amount
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {order.total}৳
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Tag size={12} />
                    {order.items.length}{" "}
                    {order.items.length > 1 ? "Items" : "Item"}
                  </span>
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    View Details
                    <ChevronRight size={14} className="text-gray-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Hidden on mobile/tablet) */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Order Id
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Date
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Total
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                    Payment
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="hover:bg-blue-50/20 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-6 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {order.id}
                    </td>
                    <td className="px-6 py-6 text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 font-bold text-gray-900">
                      {order.total}৳
                    </td>
                    <td className="px-6 py-6 text-gray-600 flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-400" />
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
