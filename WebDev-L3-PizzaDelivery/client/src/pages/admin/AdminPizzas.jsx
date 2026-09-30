import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";

import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
  Pizza as PizzaIcon,
} from "lucide-react";

import api from "../../services/api";

const CATEGORIES = [
  "Classic",
  "Veg",
  "Loaded",
  "Spicy",
  "Cheesy",
  "Mexican",
];

const EMPTY_FORM = {
  name: "",
  category: "Classic",
  price: "",
  oldPrice: "",
  rating: "0",
  reviews: "0",
  image: "",
  tag: "",
  description: "",
  isAvailable: true,
};

export default function AdminPizzas() {
  const [pizzas, setPizzas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false);

  const [activePizza, setActivePizza] = useState(null);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [submitting, setSubmitting] =
    useState(false);

  const [notification, setNotification] =
    useState(null);

  // =====================================================
  // FETCH PIZZAS
  // =====================================================

  const fetchPizzas = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data } = await api.get("/pizzas");

      setPizzas(data?.pizzas || data || []);
    } catch (err) {
      console.error("Fetch pizzas error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load pizzas from server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        pizza.name
          ?.toLowerCase()
          .includes(searchText) ||
        pizza.description
          ?.toLowerCase()
          .includes(searchText) ||
        pizza.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        pizza.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [pizzas, search, selectedCategory]);

  // =====================================================
  // STATS
  // =====================================================

  const totalPizzas = pizzas.length;

  const availablePizzas = pizzas.filter(
    (pizza) => pizza.isAvailable !== false
  ).length;

  const unavailablePizzas = pizzas.filter(
    (pizza) => pizza.isAvailable === false
  ).length;

  const popularPizzas = pizzas.filter(
    (pizza) =>
      pizza.tag &&
      pizza.tag.toLowerCase() !== ""
  ).length;

  // =====================================================
  // OPEN ADD
  // =====================================================

  const handleOpenAdd = () => {
    setFormData({
      ...EMPTY_FORM,
    });

    setActivePizza(null);

    setIsAddModalOpen(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = (pizza) => {
    setActivePizza(pizza);

    setFormData({
      name: pizza.name || "",
      category: pizza.category || "Classic",
      price:
        pizza.price !== undefined
          ? pizza.price.toString()
          : "",
      oldPrice:
        pizza.oldPrice !== null &&
        pizza.oldPrice !== undefined
          ? pizza.oldPrice.toString()
          : "",
      rating:
        pizza.rating !== undefined
          ? pizza.rating.toString()
          : "0",
      reviews:
        pizza.reviews !== undefined
          ? pizza.reviews.toString()
          : "0",
      image: pizza.image || "",
      tag: pizza.tag || "",
      description: pizza.description || "",
      isAvailable:
        pizza.isAvailable !== false,
    });

    setIsEditModalOpen(true);
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleOpenView = (pizza) => {
    setActivePizza(pizza);
    setIsViewModalOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleOpenDelete = (pizza) => {
    setActivePizza(pizza);
    setIsDeleteModalOpen(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification(
        "Pizza name is required.",
        "error"
      );
      return false;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      showNotification(
        "Please enter a valid price.",
        "error"
      );
      return false;
    }

    if (!formData.image.trim()) {
      showNotification(
        "Pizza image URL is required.",
        "error"
      );
      return false;
    }

    if (!formData.description.trim()) {
      showNotification(
        "Pizza description is required.",
        "error"
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // CREATE PIZZA
  // =====================================================

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        oldPrice:
          formData.oldPrice === ""
            ? null
            : Number(formData.oldPrice),
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0,
        image: formData.image.trim(),
        tag: formData.tag.trim(),
        description:
          formData.description.trim(),
        isAvailable: formData.isAvailable,
      };

      await api.post("/pizzas", payload);

      setIsAddModalOpen(false);

      showNotification(
        `"${formData.name}" added successfully.`
      );

      setFormData(EMPTY_FORM);

      await fetchPizzas();
    } catch (err) {
      console.error(
        "Create pizza error:",
        err
      );

      showNotification(
        err.response?.data?.message ||
          err.message ||
          "Failed to add pizza.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // UPDATE PIZZA
  // =====================================================

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!activePizza) return;

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        oldPrice:
          formData.oldPrice === ""
            ? null
            : Number(formData.oldPrice),
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0,
        image: formData.image.trim(),
        tag: formData.tag.trim(),
        description:
          formData.description.trim(),
        isAvailable: formData.isAvailable,
      };

      await api.put(
        `/pizzas/${activePizza._id}`,
        payload
      );

      setIsEditModalOpen(false);

      showNotification(
        `"${formData.name}" updated successfully.`
      );

      setActivePizza(null);

      await fetchPizzas();
    } catch (err) {
      console.error(
        "Update pizza error:",
        err
      );

      showNotification(
        err.response?.data?.message ||
          err.message ||
          "Failed to update pizza.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE PIZZA
  // =====================================================

  const handleDeleteSubmit = async () => {
    if (!activePizza) return;

    try {
      setSubmitting(true);

      await api.delete(
        `/pizzas/${activePizza._id}`
      );

      setIsDeleteModalOpen(false);

      showNotification(
        `"${activePizza.name}" deleted successfully.`
      );

      setActivePizza(null);

      await fetchPizzas();
    } catch (err) {
      console.error(
        "Delete pizza error:",
        err
      );

      showNotification(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete pizza.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // CLOSE MODALS
  // =====================================================

  const closeAllModals = () => {
    if (submitting) return;

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);

    setActivePizza(null);
    setFormData(EMPTY_FORM);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ================================================= */}
        {/* NOTIFICATION */}
        {/* ================================================= */}

        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl ${
              notification.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-gray-800 bg-gray-900 text-white"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle
                size={18}
                className="shrink-0"
              />
            ) : (
              <CheckCircle2
                size={18}
                className="shrink-0 text-green-400"
              />
            )}

            <span className="text-sm font-semibold">
              {notification.message}
            </span>

            <button
              onClick={() =>
                setNotification(null)
              }
              className="ml-1"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

          <div>
            <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
              Management
            </p>

            <h1 className="text-3xl md:text-4xl font-black mt-1">
              Pizza Menu
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your pizza menu, pricing,
              availability and details.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => fetchPizzas(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-gray-300 transition disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin text-red-600"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              onClick={handleOpenAdd}
              className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 shadow-lg shadow-red-200 transition"
            >
              <Plus size={18} />

              Add Pizza
            </button>

          </div>
        </div>

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Pizzas"
            value={totalPizzas}
            icon={PizzaIcon}
            bg="bg-red-50"
            color="text-red-600"
          />

          <StatCard
            title="Available"
            value={availablePizzas}
            icon={CheckCircle2}
            bg="bg-green-50"
            color="text-green-600"
          />

          <StatCard
            title="Unavailable"
            value={unavailablePizzas}
            icon={AlertCircle}
            bg="bg-gray-100"
            color="text-gray-500"
          />

          <StatCard
            title="Tagged Items"
            value={popularPizzas}
            icon={Star}
            bg="bg-yellow-50"
            color="text-yellow-600"
          />

        </div>

        {/* ================================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================================= */}

        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">

          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 w-full">

            <Search
              size={18}
              className="text-gray-400 shrink-0"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search pizza name or category..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
            />

          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">

            <span className="text-xs font-bold text-gray-400 shrink-0 hidden sm:inline">
              Category:
            </span>

            {["All", ...CATEGORIES].map(
              (category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                    selectedCategory ===
                    category
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              )
            )}

          </div>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">

              <Loader2
                size={36}
                className="text-red-600 animate-spin"
              />

              <p className="text-sm font-bold text-gray-500">
                Loading pizzas from MongoDB...
              </p>

            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-600 px-4">

              <AlertCircle
                size={32}
                className="mx-auto mb-3"
              />

              <p className="font-bold">
                {error}
              </p>

              <button
                onClick={() =>
                  fetchPizzas()
                }
                className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100"
              >
                Try Again
              </button>

            </div>
          ) : filteredPizzas.length === 0 ? (
            <div className="py-20 text-center px-4">

              <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <PizzaIcon size={28} />
              </div>

              <h3 className="font-black text-gray-800 text-lg">
                No Pizzas Found
              </h3>

              <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                {search ||
                selectedCategory !==
                  "All"
                  ? "No pizzas match your filter criteria."
                  : "Your database currently has no pizzas."}
              </p>

              <button
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
              >
                <Plus size={16} />
                Add Pizza
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">

                  <tr>
                    <th className="text-left px-6 py-4">
                      Pizza
                    </th>

                    <th className="text-left px-6 py-4">
                      Category
                    </th>

                    <th className="text-left px-6 py-4">
                      Price
                    </th>

                    <th className="text-left px-6 py-4">
                      Rating
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-right px-6 py-4">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredPizzas.map(
                    (pizza) => (
                      <tr
                        key={pizza._id}
                        className="hover:bg-gray-50/70 transition"
                      >

                        {/* PIZZA */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3 min-w-[250px]">

                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">

                              {pizza.image ? (
                                <img
                                  src={pizza.image}
                                  alt={pizza.name}
                                  className="w-full h-full object-cover"
                                  onError={(
                                    e
                                  ) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon
                                    size={20}
                                  />
                                </div>
                              )}

                            </div>

                            <div>

                              <div className="flex items-center gap-2">

                                <span className="font-bold text-gray-900 block">
                                  {pizza.name}
                                </span>

                                {pizza.tag && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black">
                                    {pizza.tag}
                                  </span>
                                )}

                              </div>

                              <span className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                                {pizza.description}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-5">

                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                            {pizza.category}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          <div className="font-black text-gray-900">
                            ₹{pizza.price}
                          </div>

                          {pizza.oldPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ₹{pizza.oldPrice}
                            </div>
                          )}

                        </td>

                        {/* RATING */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-1">

                            <Star
                              size={15}
                              className="text-yellow-500"
                              fill="currentColor"
                            />

                            <span className="font-bold text-gray-800">
                              {pizza.rating ||
                                0}
                            </span>

                            <span className="text-xs text-gray-400">
                              (
                              {pizza.reviews ||
                                0}
                              )
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          {pizza.isAvailable !==
                          false ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <CheckCircle2
                                size={12}
                              />
                              Available
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <AlertCircle
                                size={12}
                              />
                              Unavailable
                            </span>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                handleOpenView(
                                  pizza
                                )
                              }
                              title="View pizza"
                              className="p-2 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition"
                            >
                              <Eye
                                size={15}
                              />
                            </button>

                            <button
                              onClick={() =>
                                handleOpenEdit(
                                  pizza
                                )
                              }
                              title="Edit pizza"
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                            >
                              <Edit3
                                size={15}
                              />
                            </button>

                            <button
                              onClick={() =>
                                handleOpenDelete(
                                  pizza
                                )
                              }
                              title="Delete pizza"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* ADD MODAL */}
      {/* ================================================= */}

      {isAddModalOpen && (
        <PizzaFormModal
          title="Add New Pizza"
          subtitle="Create a new pizza menu item"
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleCreateSubmit}
          closeModal={closeAllModals}
          submitting={submitting}
          submitText="Add Pizza"
        />
      )}

      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {isEditModalOpen && (
        <PizzaFormModal
          title="Edit Pizza"
          subtitle="Update pizza details"
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleEditSubmit}
          closeModal={closeAllModals}
          submitting={submitting}
          submitText="Save Changes"
        />
      )}

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {isViewModalOpen &&
        activePizza && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">

              <div className="relative">

                {activePizza.image ? (
                  <img
                    src={activePizza.image}
                    alt={activePizza.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <PizzaIcon
                      size={60}
                      className="text-gray-300"
                    />
                  </div>
                )}

                <button
                  onClick={closeAllModals}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-gray-600 hover:text-gray-900 shadow"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                      {activePizza.category}
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      {activePizza.name}
                    </h2>

                  </div>

                  {activePizza.tag && (
                    <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black">
                      {activePizza.tag}
                    </span>
                  )}

                </div>

                <p className="text-gray-500 text-sm leading-6 mt-4">
                  {activePizza.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">

                  <InfoBox
                    label="Price"
                    value={`₹${activePizza.price}`}
                  />

                  <InfoBox
                    label="Old Price"
                    value={
                      activePizza.oldPrice
                        ? `₹${activePizza.oldPrice}`
                        : "—"
                    }
                  />

                  <InfoBox
                    label="Rating"
                    value={`⭐ ${
                      activePizza.rating ||
                      0
                    }`}
                  />

                  <InfoBox
                    label="Reviews"
                    value={
                      activePizza.reviews ||
                      0
                    }
                  />

                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">

                  {activePizza.isAvailable !==
                  false ? (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2
                        size={13}
                      />
                      Available
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <AlertCircle
                        size={13}
                      />
                      Unavailable
                    </span>
                  )}

                  <button
                    onClick={() =>
                      handleOpenEdit(
                        activePizza
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                  >
                    Edit Pizza
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {isDeleteModalOpen &&
        activePizza && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">

              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={26} />
              </div>

              <h2 className="text-xl font-black">
                Delete Pizza?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900">
                  {activePizza.name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3 mt-6">

                <button
                  onClick={closeAllModals}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteSubmit}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>

              </div>

            </div>
          </div>
        )}
    </AdminLayout>
  );
}

// =======================================================
// STAT CARD
// =======================================================

function StatCard({
  title,
  value,
  icon: Icon,
  bg,
  color,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-black text-gray-900 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center`}
        >
          <Icon size={21} />
        </div>

      </div>
    </div>
  );
}

// =======================================================
// INFO BOX
// =======================================================

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[11px] text-gray-400 font-bold uppercase">
        {label}
      </p>

      <p className="text-sm font-black text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

// =======================================================
// PIZZA FORM MODAL
// =======================================================

function PizzaFormModal({
  title,
  subtitle,
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  closeModal,
  submitting,
  submitText,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">

        {/* HEADER */}

        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 sm:px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <PizzaIcon size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                {title}
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                {subtitle}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 space-y-5"
        >

          {/* NAME */}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Pizza Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Farmhouse Pizza"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
            />
          </div>

          {/* CATEGORY + TAG */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold bg-white"
              >
                {CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Tag
              </label>

              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Best Seller / New / Spicy"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
              />
            </div>

          </div>

          {/* PRICE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="299"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Old Price (₹)
              </label>

              <input
                type="number"
                name="oldPrice"
                min="0"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="399"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
              />
            </div>

          </div>

          {/* RATING + REVIEWS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Reviews
              </label>

              <input
                type="number"
                name="reviews"
                min="0"
                value={formData.reviews}
                onChange={handleChange}
                placeholder="120"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
              />
            </div>

          </div>

          {/* IMAGE */}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/pizza.jpg"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
            />

            {formData.image && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden bg-gray-100">

                <img
                  src={formData.image}
                  alt="Pizza preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Fresh vegetables, mozzarella cheese and delicious pizza sauce..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold resize-none"
            />
          </div>

          {/* AVAILABLE */}

          <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer">

            <div className="flex items-center gap-3">

              {formData.isAvailable ? (
                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />
              ) : (
                <AlertCircle
                  size={19}
                  className="text-gray-400"
                />
              )}

              <div>

                <p className="text-sm font-bold text-gray-800">
                  Available on Menu
                </p>

                <p className="text-xs text-gray-500">
                  Customers can see and order this pizza
                </p>

              </div>
            </div>

            <input
              type="checkbox"
              name="isAvailable"
              checked={
                formData.isAvailable
              }
              onChange={handleChange}
              className="w-4 h-4 accent-red-600"
            />

          </label>

          {/* ACTIONS */}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-5 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Saving..."
                : submitText}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}