import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "./AdminLayout";

import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "..//../services/api";

import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  UtensilsCrossed,
  Layers3,
  Droplets,
  CircleDot,
  Salad,
  CheckCircle2,
  XCircle,
  Star,
  AlertCircle,
} from "lucide-react";

// =========================================================
// TYPE CONFIG
// =========================================================

const TYPE_CONFIG = {
  base: {
    label: "Base",
    icon: Layers3,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },

  sauce: {
    label: "Sauce",
    icon: Droplets,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
  },

  cheese: {
    label: "Cheese",
    icon: CircleDot,
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-100",
  },

  topping: {
    label: "Topping",
    icon: Salad,
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
};

// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
  name: "",
  type: "base",
  price: "",
  icon: "🍕",
  description: "",
  popular: false,
  isAvailable: true,
};

// =========================================================
// COMPONENT
// =========================================================

const AdminIngredients = () => {
  // =======================================================
  // STATE
  // =======================================================

  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const [showModal, setShowModal] =
    useState(false);

  const [editingIngredient, setEditingIngredient] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [notification, setNotification] =
    useState(null);

  // =======================================================
  // FETCH INGREDIENTS
  // =======================================================

  const fetchIngredients = async (
    showRefreshLoader = false
  ) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getIngredients();

      const list = Array.isArray(
        response?.data?.ingredients
      )
        ? response.data.ingredients
        : [];

      setIngredients(list);
    } catch (err) {
      console.error(
        "Fetch ingredients error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load ingredients. Please check your server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    fetchIngredients();
  }, []);

  // =======================================================
  // NOTIFICATION
  // =======================================================

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
    }, 3000);
  };

  // =======================================================
  // SUMMARY COUNTS
  // =======================================================

  const summary = useMemo(() => {
    return {
      total: ingredients.length,

      base: ingredients.filter(
        (item) => item.type === "base"
      ).length,

      sauce: ingredients.filter(
        (item) => item.type === "sauce"
      ).length,

      cheese: ingredients.filter(
        (item) => item.type === "cheese"
      ).length,

      topping: ingredients.filter(
        (item) => item.type === "topping"
      ).length,
    };
  }, [ingredients]);

  // =======================================================
  // FILTER
  // =======================================================

  const filteredIngredients = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return ingredients.filter(
      (ingredient) => {
        const matchesSearch =
          ingredient.name
            ?.toLowerCase()
            .includes(searchValue) ||
          ingredient.description
            ?.toLowerCase()
            .includes(searchValue);

        const matchesType =
          typeFilter === "all" ||
          ingredient.type === typeFilter;

        return (
          matchesSearch &&
          matchesType
        );
      }
    );
  }, [
    ingredients,
    search,
    typeFilter,
  ]);

  // =======================================================
  // OPEN ADD MODAL
  // =======================================================

  const handleAdd = () => {
    setEditingIngredient(null);
    setForm({
      ...EMPTY_FORM,
    });
    setShowModal(true);
  };

  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);

    setForm({
      name: ingredient.name || "",
      type: ingredient.type || "base",
      price: ingredient.price ?? "",
      icon: ingredient.icon || "🍕",
      description:
        ingredient.description || "",
      popular: Boolean(
        ingredient.popular
      ),
      isAvailable:
        ingredient.isAvailable !== false,
    });

    setShowModal(true);
  };

  // =======================================================
  // FORM CHANGE
  // =======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =======================================================
  // SAVE INGREDIENT
  // =======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------------------------
    // NAME VALIDATION
    // -----------------------------------------------

    const trimmedName =
      form.name.trim();

    if (!trimmedName) {
      showNotification(
        "Ingredient name is required.",
        "error"
      );
      return;
    }

    // -----------------------------------------------
    // PRICE VALIDATION
    // -----------------------------------------------

    if (
      form.price === "" ||
      form.price === null ||
      form.price === undefined ||
      !Number.isFinite(
        Number(form.price)
      ) ||
      Number(form.price) < 0
    ) {
      showNotification(
        "Please enter a valid price.",
        "error"
      );
      return;
    }

    // -----------------------------------------------
    // TYPE VALIDATION
    // -----------------------------------------------

    const allowedTypes = [
      "base",
      "sauce",
      "cheese",
      "topping",
    ];

    if (!allowedTypes.includes(form.type)) {
      showNotification(
        "Please select a valid ingredient type.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      // ---------------------------------------------
      // CLEAN PAYLOAD
      // ---------------------------------------------

      const payload = {
        name: trimmedName,
        type: form.type,
        price: Number(form.price),
        icon:
          form.icon?.trim() || "🍕",
        description:
          form.description?.trim() || "",
        popular: Boolean(
          form.popular
        ),
        isAvailable: Boolean(
          form.isAvailable
        ),
      };

      // ---------------------------------------------
      // UPDATE
      // ---------------------------------------------

      if (editingIngredient?._id) {
        const response =
          await updateIngredient(
            editingIngredient._id,
            payload
          );

        const updatedIngredient =
          response?.data?.ingredient;

        if (!updatedIngredient) {
          throw new Error(
            "Updated ingredient data was not returned by server."
          );
        }

        setIngredients((prev) =>
          prev.map((item) =>
            item._id ===
            editingIngredient._id
              ? updatedIngredient
              : item
          )
        );

        showNotification(
          "Ingredient updated successfully."
        );
      }

      // ---------------------------------------------
      // CREATE
      // ---------------------------------------------

      else {
        const response =
          await createIngredient(
            payload
          );

        const createdIngredient =
          response?.data?.ingredient;

        if (!createdIngredient) {
          throw new Error(
            "Created ingredient data was not returned by server."
          );
        }

        setIngredients((prev) => [
          createdIngredient,
          ...prev,
        ]);

        showNotification(
          "Ingredient added successfully."
        );
      }

      // ---------------------------------------------
      // CLOSE
      // ---------------------------------------------

      setShowModal(false);
      setEditingIngredient(null);
      setForm({
        ...EMPTY_FORM,
      });
    } catch (err) {
      console.error(
        "Save ingredient error:",
        err
      );

      showNotification(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save ingredient.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete = async (id) => {
    if (!id) {
      showNotification(
        "Ingredient ID is missing.",
        "error"
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this ingredient?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response =
        await deleteIngredient(id);

      if (
        response?.data?.success === false
      ) {
        throw new Error(
          response?.data?.message ||
            "Failed to delete ingredient."
        );
      }

      setIngredients((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      showNotification(
        "Ingredient deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete ingredient error:",
        err
      );

      showNotification(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete ingredient.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =======================================================
  // CLOSE MODAL
  // =======================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingIngredient(null);
    setForm({
      ...EMPTY_FORM,
    });
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-7">

        {/* =================================================
            NOTIFICATION
        ================================================= */}

        {notification && (
          <div
            role="alert"
            className={`fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              notification.type ===
              "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {notification.type ===
            "error" ? (
              <AlertCircle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <span className="text-sm font-medium">
              {notification.message}
            </span>

            <button
              type="button"
              onClick={() =>
                setNotification(null)
              }
              className="ml-2"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">
              Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Ingredients
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage pizza bases, sauces,
              cheeses and toppings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchIngredients(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            {/* ADD */}

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <Plus size={18} />

              Add Ingredient
            </button>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Bases"
            count={summary.base}
            icon={Layers3}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />

          <SummaryCard
            title="Sauces"
            count={summary.sauce}
            icon={Droplets}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />

          <SummaryCard
            title="Cheese"
            count={summary.cheese}
            icon={CircleDot}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <SummaryCard
            title="Toppings"
            count={summary.topping}
            icon={Salad}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search ingredients..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap items-center gap-2">
              <FilterButton
                active={
                  typeFilter === "all"
                }
                onClick={() =>
                  setTypeFilter("all")
                }
              >
                All ({summary.total})
              </FilterButton>

              <FilterButton
                active={
                  typeFilter === "base"
                }
                onClick={() =>
                  setTypeFilter("base")
                }
              >
                Base ({summary.base})
              </FilterButton>

              <FilterButton
                active={
                  typeFilter === "sauce"
                }
                onClick={() =>
                  setTypeFilter("sauce")
                }
              >
                Sauce ({summary.sauce})
              </FilterButton>

              <FilterButton
                active={
                  typeFilter === "cheese"
                }
                onClick={() =>
                  setTypeFilter("cheese")
                }
              >
                Cheese ({summary.cheese})
              </FilterButton>

              <FilterButton
                active={
                  typeFilter === "topping"
                }
                onClick={() =>
                  setTypeFilter("topping")
                }
              >
                Topping ({summary.topping})
              </FilterButton>
            </div>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-red-600"
            />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading ingredients...
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle
              size={30}
              className="mx-auto text-red-600"
            />

            <p className="mt-3 font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchIngredients()
              }
              className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredIngredients.length ===
            0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <UtensilsCrossed
                  size={26}
                />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No ingredients found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or
                filter.
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Plus size={17} />
                Add Ingredient
              </button>
            </div>
          )}

        {/* =================================================
            INGREDIENT GRID
        ================================================= */}

        {!loading &&
          !error &&
          filteredIngredients.length >
            0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredIngredients.map(
                (ingredient) => (
                  <IngredientCard
                    key={ingredient._id}
                    ingredient={ingredient}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                  />
                )
              )}
            </div>
          )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading &&
          !error &&
          ingredients.length > 0 && (
            <p className="text-center text-xs text-gray-400">
              Showing{" "}
              {filteredIngredients.length}{" "}
              of {ingredients.length}{" "}
              ingredients
            </p>
          )}
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  Ingredient Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {editingIngredient
                    ? "Edit Ingredient"
                    : "Add Ingredient"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* NAME + ICON */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_100px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Ingredient Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Mozzarella"
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="🍕"
                    maxLength={10}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-xl outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {/* TYPE + PRICE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="base">
                      Base
                    </option>

                    <option value="sauce">
                      Sauce
                    </option>

                    <option value="cheese">
                      Cheese
                    </option>

                    <option value="topping">
                      Topping
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Short ingredient description..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* OPTIONS */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {/* POPULAR */}

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Star
                      size={18}
                      className="text-yellow-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Popular
                      </p>

                      <p className="text-xs text-gray-500">
                        Highlight this ingredient
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="popular"
                    checked={form.popular}
                    onChange={handleChange}
                    className="h-4 w-4 accent-red-600"
                  />
                </label>

                {/* AVAILABLE */}

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    {form.isAvailable ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-600"
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="text-gray-400"
                      />
                    )}

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Available
                      </p>

                      <p className="text-xs text-gray-500">
                        Show in pizza builder
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={
                      form.isAvailable
                    }
                    onChange={handleChange}
                    className="h-4 w-4 accent-red-600"
                  />
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingIngredient
                    ? "Update Ingredient"
                    : "Add Ingredient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  title,
  count,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {count}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

// =========================================================
// FILTER BUTTON
// =========================================================

const FilterButton = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
        active
          ? "bg-red-600 text-white shadow-sm"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
};

// =========================================================
// INGREDIENT CARD
// =========================================================

const IngredientCard = ({
  ingredient,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const config =
    TYPE_CONFIG[ingredient.type] ||
    TYPE_CONFIG.topping;

  const TypeIcon = config.icon;

  const isAvailable =
    ingredient.isAvailable !== false;

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* TOP */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg} text-2xl`}
          >
            {ingredient.icon || "🍕"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">
                {ingredient.name}
              </h3>

              {ingredient.popular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-bold text-yellow-700">
                  <Star
                    size={10}
                    fill="currentColor"
                  />
                  Popular
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              <TypeIcon
                size={13}
                className={config.text}
              />

              <span
                className={`text-xs font-semibold ${config.text}`}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* AVAILABILITY */}

        {isAvailable ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
            <CheckCircle2 size={11} />
            Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
            <XCircle size={11} />
            Unavailable
          </span>
        )}
      </div>

      {/* DESCRIPTION */}

      <p className="mt-4 min-h-[40px] text-sm leading-5 text-gray-500">
        {ingredient.description ||
          "No description available."}
      </p>

      {/* DIVIDER */}

      <div className="my-4 border-t border-gray-100" />

      {/* BOTTOM */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Additional Price
          </p>

          <p className="mt-0.5 text-lg font-bold text-gray-900">
            ₹{Number(ingredient.price || 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              onEdit(ingredient)
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Pencil size={14} />
            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete(ingredient._id)
            }
            disabled={
              deletingId === ingredient._id
            }
            aria-label={`Delete ${ingredient.name}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingId ===
            ingredient._id ? (
              <RefreshCw
                size={14}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default AdminIngredients;