"use client";

import {
  useGetFilteredAnalyticsQuery,
  useGetLifetimeAnalyticsQuery,
} from "@/src/store/api/analyticsApi";
import {
  BarChart2,
  Clock,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsSkeleton } from "@/components/ui/SkeletonComponents";

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const { data: lifetimeData, isLoading: isLifetimeLoading } =
    useGetLifetimeAnalyticsQuery();
  const { data: filteredData, isLoading: isFilteredLoading } =
    useGetFilteredAnalyticsQuery(filter);

  if (isLifetimeLoading || isFilteredLoading) {
    return <AnalyticsSkeleton />;
  }

  const lifetime = lifetimeData || {
    totalRevenue: 0,
    totalOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
  };

  const chartData =
    filteredData?.map((item: any) => {
      let label = "";
      if (filter === "daily") label = `${item._id.month}/${item._id.day}`;
      else if (filter === "weekly") label = `W${item._id.week}`;
      else if (filter === "monthly")
        label = `${item._id.month}/${item._id.year.toString().slice(2)}`;
      else label = item._id.year.toString();

      return {
        ...item,
        name: label,
      };
    }) || [];

  const lifetimeCards = [
    {
      label: "Lifetime Revenue",
      value: `৳${lifetime.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Volume",
      value: lifetime.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Cancelled",
      value: lifetime.cancelledOrders.toLocaleString(),
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Pending",
      value: lifetime.pendingOrders.toLocaleString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0B1221] tracking-tight mb-2 uppercase italic">
            Deep Analytics.
          </h1>
          <p className="text-[#0B1221]/40 text-sm font-bold uppercase tracking-widest">
            Detailed performance auditing & forecasting.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-black/5 shadow-sm">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === period
                  ? "bg-[#0B1221] text-white shadow-lg"
                  : "text-[#0B1221]/40 hover:text-[#0B1221] hover:bg-gray-50"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lifetimeCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-black/5 flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">
                {card.label}
              </p>
              <h3 className="text-3xl font-black text-[#0B1221] tracking-tighter">
                {card.value}
              </h3>
            </div>
            <div
              className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}
            >
              <card.icon size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-white p-12 rounded-[4rem] border border-black/5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-600" size={20} />
              <h2 className="text-2xl font-black text-[#0B1221] tracking-tight">
                Revenue Trends.
              </h2>
            </div>
            <p className="text-[#0B1221]/30 text-[10px] font-black uppercase tracking-widest">
              Showing {filter} calculated revenue across active segments.
            </p>
          </div>

          <div className="flex items-center gap-10">
            <div>
              <p className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-widest mb-1">
                Period Average
              </p>
              <p className="text-xl font-black text-[#0B1221]">
                ৳
                {(
                  chartData.reduce(
                    (acc: number, curr: any) => acc + curr.revenue,
                    0,
                  ) / (chartData.length || 1)
                ).toFixed(0)}
              </p>
            </div>
            <div className="w-px h-10 bg-black/5" />
            <div>
              <p className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-widest mb-1">
                Period Total
              </p>
              <p className="text-xl font-black text-blue-600">
                ৳
                {chartData
                  .reduce((acc: number, curr: any) => acc + curr.revenue, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                fontSize={10}
                fontWeight="black"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(11, 18, 33, 0.4)" }}
              />
              <YAxis
                fontSize={10}
                fontWeight="black"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(11, 18, 33, 0.4)" }}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "1.5rem",
                  border: "none",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  fontSize: "12px",
                  fontWeight: "900",
                  color: "#0B1221",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Volume */}
        <div className="bg-[#0B1221] p-10 rounded-[3.5rem] text-white">
          <div className="flex items-center gap-3 mb-10">
            <BarChart2 className="text-blue-500" size={20} />
            <h3 className="text-xl font-black tracking-tight">Order Volume.</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.3)" }}
                />
                <YAxis
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.3)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1221",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "1rem",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Metric */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-black/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-[#0B1221] tracking-tight mb-2">
              Platform Efficiency.
            </h3>
            <p className="text-[#0B1221]/40 text-sm font-medium italic">
              Average order value per {filter} snapshot.
            </p>
          </div>

          <div className="py-10 flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-[12px] border-blue-50 border-t-blue-600 animate-spin-slow rotate-45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">
                  AOV
                </span>
                <span className="text-3xl font-black text-[#0B1221]">
                  ৳
                  {(
                    chartData.reduce(
                      (acc: number, curr: any) => acc + curr.revenue,
                      0,
                    ) /
                    (chartData.reduce(
                      (acc: number, curr: any) => acc + curr.orders,
                      0,
                    ) || 1)
                  ).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-3xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#0B1221]/30 mb-1">
                Highest Snap
              </p>
              <p className="text-lg font-black text-[#0B1221]">
                ৳
                {Math.max(
                  ...chartData.map((d: any) => d.revenue),
                ).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#0B1221]/30 mb-1">
                Lowest Snap
              </p>
              <p className="text-lg font-black text-[#0B1221]">
                ৳
                {Math.min(
                  ...chartData.map((d: any) => d.revenue),
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
