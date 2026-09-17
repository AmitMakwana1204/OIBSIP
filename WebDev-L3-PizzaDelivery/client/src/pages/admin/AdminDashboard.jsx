import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";

import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Clock3,
  CheckCircle2,
  ChefHat,
  Truck,
  XCircle,
  Plus,
  RefreshCw,
  CalendarDays,
  ChevronDown,
  Pizza,
} from "lucide-react";

/* =========================================================
   DEMO DATA
   Replace this data with API data later.
========================================================= */

const stats = [
  {
    title: "Total Revenue",
    value: "₹84,650",
    change: "+12.5%",
    positive: true,
    subtitle: "vs last month",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    positive: true,
    subtitle: "vs last month",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "3,642",
    change: "+14.3%",
    positive: true,
    subtitle: "vs last month",
    icon: Users,
  },
  {
    title: "Avg. Order Value",
    value: "₹678",
    change: "-2.4%",
    positive: false,
    subtitle: "vs last month",
    icon: TrendingUp,
  },
];

const salesData = [
  { day: "Mon", revenue: 2400, orders: 32 },
  { day: "Tue", revenue: 3200, orders: 41 },
  { day: "Wed", revenue: 2100, orders: 29 },
  { day: "Thu", revenue: 3800, orders: 48 },
  { day: "Fri", revenue: 4600, orders: 57 },
  { day: "Sat", revenue: 5200, orders: 64 },
  { day: "Sun", revenue: 3900, orders: 51 },
];

const recentOrders = [
  {
    id: "#PH1024",
    customer: "Amit Makwana",
    pizza: "Custom Veg Pizza",
    amount: "₹349",
    time: "2 min ago",
    status: "In Kitchen",
  },
  {
    id: "#PH1023",
    customer: "Rahul Patel",
    pizza: "Farmhouse",
    amount: "₹299",
    time: "8 min ago",
    status: "Sent to Delivery",
  },
  {
    id: "#PH1022",
    customer: "Priya Shah",
    pizza: "Margherita",
    amount: "₹199",
    time: "15 min ago",
    status: "Order Received",
  },
  {
    id: "#PH1021",
    customer: "Jay Mehta",
    pizza: "Cheese Burst",
    amount: "₹379",
    time: "25 min ago",
    status: "Delivered",
  },
  {
    id: "#PH1020",
    customer: "Neha Patel",
    pizza: "Paneer Tikka",
    amount: "₹429",
    time: "31 min ago",
    status: "Delivered",
  },
];

const topPizzas = [
  {
    name: "Farmhouse",
    orders: 284,
    revenue: "₹84,916",
    percentage: 88,
  },
  {
    name: "Cheese Burst",
    orders: 231,
    revenue: "₹76,230",
    percentage: 76,
  },
  {
    name: "Paneer Tikka",
    orders: 198,
    revenue: "₹72,540",
    percentage: 65,
  },
  {
    name: "Margherita",
    orders: 176,
    revenue: "₹52,624",
    percentage: 58,
  },
];

const inventory = [
  {
    name: "Mozzarella Cheese",
    stock: 14,
    unit: "kg",
    level: "Critical",
  },
  {
    name: "Classic Pizza Crust",
    stock: 17,
    unit: "pcs",
    level: "Low",
  },
  {
    name: "Capsicum",
    stock: 12,
    unit: "kg",
    level: "Critical",
  },
  {
    name: "BBQ Sauce",
    stock: 18,
    unit: "bottles",
    level: "Low",
  },
];

const statusData = [
  {
    label: "Delivered",
    count: 684,
    percentage: 55,
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "In Kitchen",
    count: 216,
    percentage: 17,
    icon: ChefHat,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "On Delivery",
    count: 198,
    percentage: 16,
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Cancelled",
    count: 150,
    percentage: 12,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const [range, setRange] = useState("This Week");

  const totalRevenue = useMemo(() => {
    return salesData.reduce((sum, item) => sum + item.revenue, 0);
  }, []);

  const maxRevenue = Math.max(
    ...salesData.map((item) => item.revenue)
  );

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Live Overview
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor your pizza business performance and daily operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 transition">
              <RefreshCw size={16} />
              Refresh
            </button>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none cursor-pointer"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>

              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition">
              <Plus size={17} />
              Add Product
            </button>

          </div>

        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >

                <div className="flex items-start justify-between">

                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition">
                    <Icon size={22} />
                  </div>

                  <button className="text-gray-300 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>

                </div>

                <p className="text-sm text-gray-500 mt-5">
                  {stat.title}
                </p>

                <div className="flex items-end justify-between gap-2 mt-1">

                  <h2 className="text-2xl md:text-3xl font-black">
                    {stat.value}
                  </h2>

                </div>

                <div className="flex items-center gap-2 mt-3">

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      stat.positive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.positive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}

                    {stat.change}
                  </span>

                  <span className="text-xs text-gray-400">
                    {stat.subtitle}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            ANALYTICS SECTION
        ================================================= */}

        <div className="grid xl:grid-cols-[1fr_380px] gap-6">

          {/* SALES CHART */}

          <div className="bg-white border border-gray-100 rounded-2xl p-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>
                <h2 className="text-xl font-black">
                  Revenue Analytics
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Revenue performance for {range.toLowerCase()}.
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Total Revenue
                </p>

                <p className="text-2xl font-black">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>

            </div>

            {/* Legend */}

            <div className="flex items-center gap-5 mt-6">

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Revenue
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                Orders
              </div>

            </div>

            {/* Chart */}

            <div className="h-[300px] mt-8 flex items-end gap-3 sm:gap-5">

              {salesData.map((item) => {

                const height =
                  (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.day}
                    className="flex-1 h-full flex flex-col justify-end"
                  >

                    <div className="relative h-full flex items-end">

                      <div
                        className="w-full bg-red-500 rounded-t-xl hover:bg-red-600 transition-all duration-300 group relative"
                        style={{
                          height: `${height}%`,
                        }}
                      >

                        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap transition pointer-events-none">
                          ₹{item.revenue.toLocaleString("en-IN")}
                          <br />
                          {item.orders} orders
                        </div>

                      </div>

                    </div>

                    <span className="text-xs text-gray-400 text-center mt-3">
                      {item.day}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

          {/* ORDER STATUS */}

          <div className="bg-white border border-gray-100 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-black">
                  Order Status
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current order distribution
                </p>
              </div>

              <ShoppingBag
                size={20}
                className="text-gray-300"
              />

            </div>

            {/* Donut */}

            <div className="flex justify-center my-8">

              <div className="relative w-48 h-48">

                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#22c55e 0% 55%, #f97316 55% 72%, #3b82f6 72% 88%, #ef4444 88% 100%)",
                  }}
                />

                <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">
                    1,248
                  </span>

                  <span className="text-xs text-gray-400">
                    Total Orders
                  </span>
                </div>

              </div>

            </div>

            <div className="space-y-4">

              {statusData.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}
                      >
                        <Icon size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          {item.label}
                        </p>

                        <p className="text-xs text-gray-400">
                          {item.percentage}% of orders
                        </p>
                      </div>

                    </div>

                    <span className="font-black text-sm">
                      {item.count}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* =================================================
            TOP PRODUCTS + INVENTORY
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* TOP PIZZAS */}

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

            <div className="p-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-black">
                  Top Selling Pizzas
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Best performing products
                </p>
              </div>

              <button className="text-red-600 text-sm font-bold">
                View Products
              </button>

            </div>

            <div className="px-6 pb-6 space-y-5">

              {topPizzas.map((pizza, index) => (
                <div
                  key={pizza.name}
                  className="flex items-center gap-4"
                >

                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Pizza
                      size={19}
                      className="text-red-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between gap-3">

                      <p className="text-sm font-bold truncate">
                        {index + 1}. {pizza.name}
                      </p>

                      <span className="text-xs font-bold text-gray-500">
                        {pizza.orders} orders
                      </span>

                    </div>

                    <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">

                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${pizza.percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black">
                      {pizza.revenue}
                    </p>

                    <p className="text-xs text-gray-400">
                      Revenue
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* INVENTORY */}

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

            <div className="p-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Inventory Alerts
                  </h2>

                  <p className="text-sm text-gray-500">
                    Items requiring attention
                  </p>
                </div>

              </div>

              <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black">
                4 Alerts
              </span>

            </div>

            <div className="divide-y divide-gray-100">

              {inventory.map((item) => (

                <div
                  key={item.name}
                  className="px-6 py-4 flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Package
                        size={18}
                        className="text-gray-500"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.stock} {item.unit} remaining
                      </p>
                    </div>

                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      item.level === "Critical"
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {item.level}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h2 className="text-xl font-black">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer activity
              </p>
            </div>

            <a
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-red-600 font-bold text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </a>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-sm">

              <thead className="bg-gray-50 border-y border-gray-100">

                <tr className="text-left text-xs uppercase tracking-wider text-gray-400">

                  <th className="px-6 py-4">
                    Order
                  </th>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Time
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition"
                  >

                    <td className="px-6 py-5 font-black">
                      {order.id}
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                          {order.customer
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span className="font-semibold">
                          {order.customer}
                        </span>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-gray-500">
                      {order.pizza}
                    </td>

                    <td className="px-6 py-5 font-black">
                      {order.amount}
                    </td>

                    <td className="px-6 py-5">

                      <span className="inline-flex items-center gap-1.5 text-gray-400">
                        <Clock3 size={14} />
                        {order.time}
                      </span>

                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-5 text-right">

                      <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                        <Eye size={16} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div>

          <h2 className="text-lg font-black mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <QuickAction
              icon={Plus}
              title="Add Product"
              description="Create new pizza"
            />

            <QuickAction
              icon={Package}
              title="Inventory"
              description="Manage stock"
            />

            <QuickAction
              icon={ShoppingBag}
              title="Orders"
              description="Manage orders"
            />

            <QuickAction
              icon={Users}
              title="Customers"
              description="View customers"
            />

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {

  const styles = {
    "In Kitchen": {
      className: "bg-orange-50 text-orange-600",
      icon: ChefHat,
    },

    "Sent to Delivery": {
      className: "bg-blue-50 text-blue-600",
      icon: Truck,
    },

    "Order Received": {
      className: "bg-purple-50 text-purple-600",
      icon: Clock3,
    },

    Delivered: {
      className: "bg-green-50 text-green-600",
      icon: CheckCircle2,
    },

    Cancelled: {
      className: "bg-red-50 text-red-600",
      icon: XCircle,
    },
  };

  const config = styles[status] || {
    className: "bg-gray-50 text-gray-600",
    icon: Clock3,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
}) {
  return (
    <button className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-red-200 hover:shadow-lg transition group">

      <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition">
        <Icon size={19} />
      </div>

      <h3 className="font-black mt-4">
        {title}
      </h3>

      <p className="text-xs text-gray-400 mt-1">
        {description}
      </p>

    </button>
  );
}