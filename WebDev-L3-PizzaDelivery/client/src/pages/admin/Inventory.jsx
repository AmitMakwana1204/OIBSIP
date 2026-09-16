import { useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  AlertTriangle,
  Edit3,
  Package,
  Plus,
  Search,
} from "lucide-react";

const initialInventory = [
  {
    id: 1,
    name: "Classic Crust",
    category: "Pizza Base",
    stock: 17,
    threshold: 20,
    unit: "units",
  },
  {
    id: 2,
    name: "Thin Crust",
    category: "Pizza Base",
    stock: 48,
    threshold: 20,
    unit: "units",
  },
  {
    id: 3,
    name: "Cheese Burst",
    category: "Pizza Base",
    stock: 35,
    threshold: 20,
    unit: "units",
  },
  {
    id: 4,
    name: "Classic Tomato",
    category: "Sauce",
    stock: 52,
    threshold: 20,
    unit: "units",
  },
  {
    id: 5,
    name: "BBQ Sauce",
    category: "Sauce",
    stock: 18,
    threshold: 20,
    unit: "units",
  },
  {
    id: 6,
    name: "Mozzarella",
    category: "Cheese",
    stock: 14,
    threshold: 20,
    unit: "units",
  },
  {
    id: 7,
    name: "Cheddar",
    category: "Cheese",
    stock: 42,
    threshold: 20,
    unit: "units",
  },
  {
    id: 8,
    name: "Capsicum",
    category: "Vegetable",
    stock: 12,
    threshold: 20,
    unit: "units",
  },
];

export default function Inventory() {
  const [inventory, setInventory] =
    useState(initialInventory);

  const [search, setSearch] = useState("");

  const filtered = inventory.filter((item) =>
    `${item.name} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateStock = (id) => {
    const value = prompt("Enter new stock quantity:");

    if (value === null) return;

    setInventory((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: Number(value),
            }
          : item
      )
    );
  };

  return (
    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">

          <div>
            <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
              Management
            </p>

            <h1 className="text-3xl md:text-4xl font-black mt-1">
              Inventory
            </h1>

            <p className="text-gray-500 mt-2">
              Manage pizza ingredients and stock levels.
            </p>
          </div>

          <button className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700">
            <Plus size={18} />
            Add Item
          </button>

        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4 mb-7">

          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={19} />
          </div>

          <div>
            <h3 className="font-black text-orange-800">
              Low Stock Alert
            </h3>

            <p className="text-sm text-orange-700 mt-1">
              4 inventory items are below their configured
              threshold.
            </p>
          </div>

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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-4">
                    Item
                  </th>

                  <th className="text-left px-6 py-4">
                    Category
                  </th>

                  <th className="text-left px-6 py-4">
                    Current Stock
                  </th>

                  <th className="text-left px-6 py-4">
                    Threshold
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-right px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((item) => {

                  const low =
                    item.stock < item.threshold;

                  const percentage = Math.min(
                    (item.stock / 100) * 100,
                    100
                  );

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Package size={18} />
                          </div>

                          <span className="font-bold">
                            {item.name}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-gray-500">
                        {item.category}
                      </td>

                      <td className="px-6 py-5 min-w-48">

                        <div className="flex justify-between mb-2">
                          <span className="font-bold">
                            {item.stock}
                          </span>

                          <span className="text-xs text-gray-400">
                            {item.unit}
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            style={{
                              width: `${percentage}%`,
                            }}
                            className={`h-full rounded-full ${
                              low
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>

                      </td>

                      <td className="px-6 py-5">
                        {item.threshold}
                      </td>

                      <td className="px-6 py-5">

                        {low ? (
                          <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                            In Stock
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            updateStock(item.id)
                          }
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 font-semibold"
                        >
                          <Edit3 size={15} />
                          Update
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}