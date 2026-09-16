import { useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  ChefHat,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

const initialOrders = [
  {
    id: "#PH1024",
    customer: "Amit Makwana",
    email: "amit@example.com",
    pizza: "Custom Veg Pizza",
    amount: 349,
    status: "Order Received",
    time: "2 min ago",
  },
  {
    id: "#PH1023",
    customer: "Rahul Patel",
    email: "rahul@example.com",
    pizza: "Farmhouse",
    amount: 299,
    status: "In Kitchen",
    time: "8 min ago",
  },
  {
    id: "#PH1022",
    customer: "Priya Shah",
    email: "priya@example.com",
    pizza: "Margherita",
    amount: 199,
    status: "Sent to Delivery",
    time: "15 min ago",
  },
  {
    id: "#PH1021",
    customer: "Jay Mehta",
    email: "jay@example.com",
    pizza: "Cheese Burst",
    amount: 379,
    status: "Delivered",
    time: "30 min ago",
  },
];

const statuses = [
  "Order Received",
  "In Kitchen",
  "Sent to Delivery",
  "Delivered",
];

export default function AdminOrders() {
  const [orders, setOrders] =
    useState(initialOrders);

  const [search, setSearch] = useState("");

  const updateStatus = (id, status) => {
    setOrders((items) =>
      items.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  };

  const filtered = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.pizza}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
            Management
          </p>

          <h1 className="text-3xl md:text-4xl font-black mt-1">
            Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Manage incoming orders and update their status.
          </p>

        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-5 mb-7">

          <OrderCount
            icon={<ShoppingBag />}
            label="New Orders"
            value="12"
          />

          <OrderCount
            icon={<ChefHat />}
            label="In Kitchen"
            value="8"
          />

          <OrderCount
            icon={<Truck />}
            label="Out for Delivery"
            value="5"
          />

        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">

          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search order, customer or pizza..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

        </div>

        {/* Orders */}
        <div className="space-y-4">

          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                {/* Order info */}
                <div className="flex items-center gap-4 flex-1">

                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <ShoppingBag size={20} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black">
                        {order.id}
                      </h3>

                      <StatusBadge
                        status={order.status}
                      />
                    </div>

                    <p className="text-sm font-semibold mt-1">
                      {order.customer}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {order.email} • {order.time}
                    </p>
                  </div>

                </div>

                {/* Pizza */}
                <div className="lg:w-52">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Order
                  </p>

                  <p className="font-bold mt-1">
                    {order.pizza}
                  </p>
                </div>

                {/* Amount */}
                <div className="lg:w-28">
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Amount
                  </p>

                  <p className="text-xl font-black mt-1">
                    ₹{order.amount}
                  </p>
                </div>

                {/* Status */}
                <div className="lg:w-52">

                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                    Update Status
                  </p>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </AdminLayout>
  );
}

function OrderCount({ icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">

      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="text-2xl font-black">
          {value}
        </p>
      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Order Received":
      "bg-purple-100 text-purple-600",

    "In Kitchen":
      "bg-orange-100 text-orange-600",

    "Sent to Delivery":
      "bg-blue-100 text-blue-600",

    Delivered:
      "bg-green-100 text-green-600",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}