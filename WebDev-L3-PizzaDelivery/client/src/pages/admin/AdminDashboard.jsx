import AdminLayout from "./AdminLayout";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹84,650",
    change: "+12.5%",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    value: "3,642",
    change: "+14.3%",
    icon: Users,
  },
  {
    title: "Low Stock Items",
    value: "5",
    change: "Needs attention",
    icon: AlertTriangle,
  },
];

const recentOrders = [
  {
    id: "#PH1024",
    customer: "Amit Makwana",
    pizza: "Custom Veg Pizza",
    amount: "₹349",
    status: "In Kitchen",
  },
  {
    id: "#PH1023",
    customer: "Rahul Patel",
    pizza: "Farmhouse",
    amount: "₹299",
    status: "Sent to Delivery",
  },
  {
    id: "#PH1022",
    customer: "Priya Shah",
    pizza: "Margherita",
    amount: "₹199",
    status: "Order Received",
  },
  {
    id: "#PH1021",
    customer: "Jay Mehta",
    pizza: "Cheese Burst",
    amount: "₹379",
    status: "Delivered",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
            Overview
          </p>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

            <div>
              <h1 className="text-3xl md:text-4xl font-black mt-1">
                Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Monitor your pizza business performance.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              September 16, 2026
            </span>

          </div>

        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white border border-gray-100 rounded-2xl p-6"
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-gray-300"
                  />

                </div>

                <p className="text-gray-500 text-sm mt-5">
                  {stat.title}
                </p>

                <h2 className="text-2xl font-black mt-1">
                  {stat.value}
                </h2>

                <p className="text-xs text-green-600 font-semibold mt-2">
                  {stat.change}
                </p>

              </div>
            );
          })}

        </div>

        {/* Charts + alerts */}
        <div className="grid lg:grid-cols-[1fr_330px] gap-6 mt-7">

          {/* Sales chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-xl font-black">
                  Sales Overview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Revenue performance this week
                </p>
              </div>

              <span className="text-xl font-black">
                ₹18,420
              </span>

            </div>

            <div className="h-64 flex items-end gap-3 mt-8">

              {[45, 65, 40, 80, 60, 90, 72].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 h-full flex items-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full bg-red-500 rounded-t-lg hover:bg-red-600 transition"
                    />
                  </div>
                )
              )}

            </div>

            <div className="grid grid-cols-7 mt-3 text-xs text-gray-400 text-center">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

          </div>

          {/* Low stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <AlertTriangle size={19} />
              </div>

              <div>
                <h2 className="font-black">
                  Low Stock
                </h2>

                <p className="text-xs text-gray-500">
                  Requires attention
                </p>
              </div>

            </div>

            <div className="space-y-5 mt-7">

              <StockAlert
                name="Classic Crust"
                stock="17 units"
              />

              <StockAlert
                name="Mozzarella"
                stock="14 units"
              />

              <StockAlert
                name="Capsicum"
                stock="12 units"
              />

              <StockAlert
                name="BBQ Sauce"
                stock="18 units"
              />

            </div>

          </div>

        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 mt-7 overflow-hidden">

          <div className="p-6 flex justify-between items-center">

            <div>
              <h2 className="text-xl font-black">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders
              </p>
            </div>

            <a
              href="/admin/orders"
              className="text-red-600 font-bold text-sm"
            >
              View All
            </a>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-4">
                    Order
                  </th>

                  <th className="text-left px-6 py-4">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4">
                    Pizza
                  </th>

                  <th className="text-left px-6 py-4">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100"
                  >

                    <td className="px-6 py-4 font-bold">
                      {order.id}
                    </td>

                    <td className="px-6 py-4">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {order.pizza}
                    </td>

                    <td className="px-6 py-4 font-bold">
                      {order.amount}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

function StockAlert({ name, stock }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold">
          {name}
        </span>

        <span className="text-red-600 font-bold">
          {stock}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-red-500 w-[25%] rounded-full" />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Kitchen":
      "bg-orange-100 text-orange-600",
    "Sent to Delivery":
      "bg-blue-100 text-blue-600",
    "Order Received":
      "bg-purple-100 text-purple-600",
    Delivered:
      "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}