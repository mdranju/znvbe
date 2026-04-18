"use client";

import { useGetDashboardStatsQuery, useGetRollingAnalyticsQuery } from "@/src/store/api/analyticsApi";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardSkeleton } from "@/components/ui/SkeletonComponents";

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardOverview() {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: rollingData, isLoading: isRollingLoading } = useGetRollingAnalyticsQuery();

  const isLoading = isStatsLoading || isRollingLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!statsData || !rollingData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center">
        <XCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-[#0B1221]">Analytics Error</h3>
        <p className="text-[#0B1221]/40">
          Failed to load platform data. Please try again later.
        </p>
      </div>
    );
  }

  const stats = statsData;
  const rollingStats = rollingData || [];

  // Calculate trends based on last 2 days if possible
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { trend: "0.0%", isPositive: true };
    const latest = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    if (previous === 0) return { trend: latest > 0 ? "+100%" : "0.0%", isPositive: true };
    const diff = ((latest - previous) / previous) * 100;
    return {
      trend: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`,
      isPositive: diff >= 0
    };
  };

  const revenueTrend = calculateTrend(rollingStats, 'revenue');
  const orderTrend = calculateTrend(rollingStats, 'orders');
  const userTrend = calculateTrend(rollingStats, 'activeUsers');

  const summaryCards = [
    {
      label: "Today's Revenue",
      value: `৳${(rollingStats[rollingStats.length - 1]?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-blue-500",
      ...revenueTrend,
    },
    {
      label: "Today's Orders",
      value: (rollingStats[rollingStats.length - 1]?.orders || 0).toString(),
      icon: ShoppingBag,
      color: "bg-indigo-500",
      ...orderTrend,
    },
    {
      label: "Daily Active",
      value: (rollingStats[rollingStats.length - 1]?.activeUsers || 0).toString(),
      icon: Users,
      color: "bg-emerald-500",
      ...userTrend,
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-amber-500",
      trend: "0.0%",
      isPositive: true,
    },
  ];

  const orderStatuses = [
    {
      label: "Pending",
      value: stats.orderStatusDistribution.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Confirmed",
      value: stats.orderStatusDistribution.confirmed,
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Shipped",
      value: stats.orderStatusDistribution.shipped,
      icon: Package,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      label: "Cancelled",
      value: stats.orderStatusDistribution.cancelled,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time platform insights & performance metrics
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-black/5 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]">
            Live System Status: Normal
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-5 rounded-2xl ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon size={26} />
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B1221]/30 mb-2">
              {stat.label}
            </p>
            <h3 className="text-4xl font-black text-[#0B1221] tracking-tighter">
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 p-8 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                  Growth Stream.
                </h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                  25 Days Rolling Performance (Revenue)
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                   Peak Daily
                </p>
                <p className="text-xl font-black text-white">
                  ৳{Math.max(...rollingStats.map((s: any) => s.revenue || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recharts Linear Line Chart */}
            <div className="h-72 w-full mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rollingStats}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.split('-').slice(1).join('/')}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `৳${value}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0B1221",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "1rem",
                    }}
                    itemStyle={{
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    formatter={(value: any) => [`৳${value}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#fff" }}
                    fill="url(#colorSales)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-[#0B1221] tracking-tight mb-8 w-full">
            Inventory Spread.
          </h3>

          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Recharts Pie Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.categoryDistribution.map(
                    (entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    color: "#0B1221",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#0B1221]">
                {stats.totalProducts}
              </span>
              <span className="text-[8px] font-black text-[#0B1221]/30 uppercase tracking-[0.2em]">
                Sku Total
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 w-full">
            {stats.categoryDistribution.map((cat: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-[9px] font-black text-[#0B1221]/60 uppercase tracking-widest truncate">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Activity Tracker */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-[#0B1221] tracking-tight">
              Status flow.
            </h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Real-time
            </span>
          </div>
          <div className="space-y-6">
            {orderStatuses.map((status, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`p-4 rounded-2xl ${status.bg} ${status.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}
                  >
                    <status.icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0B1221]">
                      {status.label}
                    </p>
                    <p className="text-[9px] text-[#0B1221]/30 font-bold uppercase tracking-widest mt-0.5">
                      Global collection
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#0B1221]">
                    {status.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Bar Chart (Comparison) - Made Dynamic */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-[#0B1221] tracking-tight">
                Daily Intensity.
              </h3>
              <p className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-widest">
                Orders frequency (Last 25 Days)
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              <span className="text-[10px] font-black uppercase text-[#0B1221]/40 tracking-widest">
                Volume (Orders)
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="w-full h-80 mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rollingStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(0,0,0,0.2)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.split('-').slice(2).join('')}
                />
                <YAxis
                  stroke="rgba(0,0,0,0.2)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    color: "#0B1221",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
