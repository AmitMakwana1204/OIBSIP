import axios from "axios";

// =========================================================
// AXIOS INSTANCE
// =========================================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

api.interceptors.request.use(
  (config) => {
    // ---------------------------------------------
    // Get tokens
    // ---------------------------------------------

    const adminToken =
      localStorage.getItem(
        "pizzahub_admin_token"
      );

    const userToken =
      localStorage.getItem(
        "pizzahub_token"
      );

    // ---------------------------------------------
    // Current request URL
    // ---------------------------------------------

    const url = config.url || "";

    // ---------------------------------------------
    // HTTP method
    // ---------------------------------------------

    const method =
      config.method?.toLowerCase() ||
      "get";

    // ---------------------------------------------
    // Detect ingredient request
    // ---------------------------------------------

    const isIngredientRequest =
      url.startsWith("/ingredients");

    // ---------------------------------------------
    // Detect admin request
    // ---------------------------------------------

    const isAdminRequest =
      url.startsWith("/admin") ||
      url.startsWith("/inventory") ||
      (
        isIngredientRequest &&
        method !== "get"
      );

    // ---------------------------------------------
    // Select correct token
    // ---------------------------------------------

    const token = isAdminRequest
      ? adminToken || userToken
      : userToken || adminToken;

    // ---------------------------------------------
    // Attach Authorization header
    // ---------------------------------------------

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // =====================================================
    // SERVER RESPONSE AVAILABLE
    // =====================================================

    if (error.response) {
      const {
        status,
        config,
      } = error.response;

      const url =
        config?.url || "";

      const method =
        config?.method?.toLowerCase() ||
        "get";

      // ---------------------------------------------
      // Detect ingredient request
      // ---------------------------------------------

      const isIngredientRequest =
        url.startsWith("/ingredients");

      // ---------------------------------------------
      // Detect admin request
      // ---------------------------------------------

      const isAdminRequest =
        url.startsWith("/admin") ||
        url.startsWith("/inventory") ||
        (
          isIngredientRequest &&
          method !== "get"
        );

      // ===================================================
      // 401 UNAUTHORIZED
      // ===================================================

      if (status === 401) {
        if (isAdminRequest) {
          // -----------------------------------------------
          // Admin session expired
          // -----------------------------------------------

          localStorage.removeItem(
            "pizzahub_admin_token"
          );

          localStorage.removeItem(
            "pizzahub_admin_user"
          );
        } else {
          // -----------------------------------------------
          // User session expired
          // -----------------------------------------------

          localStorage.removeItem(
            "pizzahub_token"
          );

          localStorage.removeItem(
            "pizzahub_user"
          );
        }
      }

      return Promise.reject(error);
    }

    // =====================================================
    // NETWORK ERROR
    // =====================================================

    if (error.request) {
      return Promise.reject(
        new Error(
          "Unable to connect to server. Please check your backend connection."
        )
      );
    }

    // =====================================================
    // UNKNOWN ERROR
    // =====================================================

    return Promise.reject(
      new Error(
        error.message ||
          "Something went wrong. Please try again."
      )
    );
  }
);

// =========================================================
// AUTH API
// =========================================================

// Register user
export const registerUser = (data) =>
  api.post(
    "/auth/register",
    data
  );

// Login user
export const loginUser = (data) =>
  api.post(
    "/auth/login",
    data
  );

// Verify email
export const verifyEmailToken = (
  token
) =>
  api.get(
    `/auth/verify-email?token=${encodeURIComponent(
      token
    )}`
  );

// Forgot password
export const forgotPasswordRequest = (
  data
) =>
  api.post(
    "/auth/forgot-password",
    data
  );

// Reset password
export const resetPasswordRequest = (
  token,
  data
) =>
  api.post(
    `/auth/reset-password/${encodeURIComponent(
      token
    )}`,
    data
  );

// =========================================================
// USER PROFILE
// =========================================================

// Get current logged-in user
export const getCurrentUser = () => {
  return api.get(
    "/auth/me"
  );
};

// Update user profile
export const updateUserProfile = (
  data
) => {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Profile data is required"
      )
    );
  }

  return api.put(
    "/auth/profile",
    data
  );
};

// =========================================================
// CHANGE USER PASSWORD
// =========================================================

export const changeUserPassword = (
  data
) => {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Password data is required"
      )
    );
  }

  return api.put(
    "/auth/change-password",
    data
  );
};

// =========================================================
// ADMIN AUTH API
// =========================================================

// Admin login
export const adminLoginApi = (
  data
) =>
  api.post(
    "/admin/login",
    data
  );

// =========================================================
// ADMIN DASHBOARD API
// =========================================================

// Dashboard statistics
export const getAdminDashboardStats =
  () =>
    api.get(
      "/admin/dashboard"
    );

// =========================================================
// ADMIN INVENTORY APIs
// =========================================================

// Get all inventory
export const getAdminInventory = () =>
  api.get(
    "/inventory"
  );

// Get single inventory item
export const getAdminInventoryItem = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Inventory ID is required"
      )
    );
  }

  return api.get(
    `/inventory/${encodeURIComponent(
      id
    )}`
  );
};

// Create inventory item
export const createAdminInventory = (
  data
) =>
  api.post(
    "/inventory",
    data
  );

// Update inventory item
export const updateAdminInventory = (
  id,
  data
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Inventory ID is required"
      )
    );
  }

  return api.patch(
    `/inventory/${encodeURIComponent(
      id
    )}`,
    data
  );
};

// Update stock
export const updateAdminInventoryStock = (
  id,
  stock
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Inventory ID is required"
      )
    );
  }

  if (
    stock === undefined ||
    stock === null ||
    Number(stock) < 0
  ) {
    return Promise.reject(
      new Error(
        "Valid stock value is required"
      )
    );
  }

  return api.patch(
    `/inventory/${encodeURIComponent(
      id
    )}/stock`,
    {
      stock: Number(stock),
    }
  );
};

// Delete inventory item
export const deleteAdminInventory = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Inventory ID is required"
      )
    );
  }

  return api.delete(
    `/inventory/${encodeURIComponent(
      id
    )}`
  );
};

// =========================================================
// INGREDIENT APIs
// =========================================================

// Get all available ingredients
export const getIngredients = () =>
  api.get(
    "/ingredients"
  );

// Get single ingredient
export const getIngredientById = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Ingredient ID is required"
      )
    );
  }

  return api.get(
    `/ingredients/${encodeURIComponent(
      id
    )}`
  );
};

// =========================================================
// ADMIN INGREDIENT APIs
// =========================================================

// Create ingredient
export const createIngredient = (
  data
) => {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Ingredient data is required"
      )
    );
  }

  return api.post(
    "/ingredients",
    data
  );
};

// Update ingredient
export const updateIngredient = (
  id,
  data
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Ingredient ID is required"
      )
    );
  }

  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Ingredient data is required"
      )
    );
  }

  return api.put(
    `/ingredients/${encodeURIComponent(
      id
    )}`,
    data
  );
};

// Delete ingredient
export const deleteIngredient = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Ingredient ID is required"
      )
    );
  }

  return api.delete(
    `/ingredients/${encodeURIComponent(
      id
    )}`
  );
};

// =========================================================
// ADMIN ORDER APIs
// =========================================================

// Get all orders
export const getAdminOrders = () =>
  api.get(
    "/admin/orders"
  );

// Get order details
export const getAdminOrderDetails = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Order ID is required"
      )
    );
  }

  return api.get(
    `/admin/orders/${encodeURIComponent(
      id
    )}`
  );
};

// Update order status
export const updateAdminOrderStatus = (
  id,
  status
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Order ID is required"
      )
    );
  }

  if (!status) {
    return Promise.reject(
      new Error(
        "Order status is required"
      )
    );
  }

  return api.patch(
    `/admin/orders/${encodeURIComponent(
      id
    )}/status`,
    {
      status,
    }
  );
};

// =========================================================
// USER ORDER APIs
// =========================================================

// Create user order
export const createUserOrder = (
  data
) =>
  api.post(
    "/orders",
    data
  );

// Get logged-in user's orders
export const getUserOrders = () =>
  api.get(
    "/orders/my-orders"
  );

// Get single user order
export const getUserOrderDetails = (
  id
) => {
  if (!id) {
    return Promise.reject(
      new Error(
        "Order ID is required"
      )
    );
  }

  return api.get(
    `/orders/my-orders/${encodeURIComponent(
      id
    )}`
  );
};

// =========================================================
// CANCEL USER ORDER
// =========================================================

export const cancelUserOrder = (
  mongoOrderId
) => {
  if (!mongoOrderId) {
    return Promise.reject(
      new Error(
        "MongoDB Order ID is required"
      )
    );
  }

  const encodedOrderId =
    encodeURIComponent(
      String(mongoOrderId)
    );

  console.log(
    "CANCEL USER ORDER API:",
    `/orders/my-orders/${encodedOrderId}/cancel`
  );

  return api.put(
    `/orders/my-orders/${encodedOrderId}/cancel`
  );
};

// =========================================================
// RAZORPAY PAYMENT APIs
// =========================================================

// Create Razorpay payment order
export const createPaymentOrder = (
  data
) => {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Payment data is required"
      )
    );
  }

  if (
    !data.amount ||
    Number(data.amount) <= 0
  ) {
    return Promise.reject(
      new Error(
        "Valid payment amount is required"
      )
    );
  }

  return api.post(
    "/payment/create-order",
    data
  );
};

// Verify Razorpay payment
export const verifyPayment = (
  data
) => {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return Promise.reject(
      new Error(
        "Payment verification data is required"
      )
    );
  }

  if (
    !data.razorpay_order_id ||
    !data.razorpay_payment_id ||
    !data.razorpay_signature
  ) {
    return Promise.reject(
      new Error(
        "Incomplete payment verification data"
      )
    );
  }

  return api.post(
    "/payment/verify",
    data
  );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default api;