import axios from "axios";

// =========================
// AXIOS INSTANCE
// =========================
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    // Check for admin token first if requesting admin or inventory endpoints, otherwise user token
    const adminToken = localStorage.getItem("pizzahub_admin_token");
    const userToken = localStorage.getItem("pizzahub_token");

    const token = config.url?.startsWith("/admin") || config.url?.startsWith("/inventory")
      ? adminToken || userToken
      : userToken || adminToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      if (status === 401) {
        if (config.url?.startsWith("/admin") || config.url?.startsWith("/inventory")) {
          localStorage.removeItem("pizzahub_admin_token");
          localStorage.removeItem("pizzahub_admin_user");
        } else {
          localStorage.removeItem("pizzahub_token");
          localStorage.removeItem("pizzahub_user");
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(
      new Error("Unable to connect to server. Please check your connection.")
    );
  }
);

// =========================
// AUTH API FUNCTIONS
// =========================
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const verifyEmailToken = (token) => api.get(`/auth/verify-email?token=${token}`);
export const forgotPasswordRequest = (data) => api.post("/auth/forgot-password", data);
export const resetPasswordRequest = (token, data) => api.post(`/auth/reset-password/${token}`, data);

// =========================
// ADMIN AUTH API
// =========================
export const adminLoginApi = (data) => api.post("/admin/login", data);

// =========================
// ADMIN DASHBOARD API
// =========================
export const getAdminDashboardStats = () => api.get("/admin/dashboard");

// =========================
// ADMIN INVENTORY APIs
// =========================
export const getAdminInventory = () => api.get("/inventory");
export const getAdminInventoryItem = (id) => api.get(`/inventory/${id}`);
export const createAdminInventory = (data) => api.post("/inventory", data);
export const updateAdminInventory = (id, data) => api.patch(`/inventory/${id}`, data);
export const updateAdminInventoryStock = (id, stock) => api.patch(`/inventory/${id}/stock`, { stock });
export const deleteAdminInventory = (id) => api.delete(`/inventory/${id}`);

// =========================
// ADMIN ORDERS APIs
// =========================
export const getAdminOrders = () => api.get("/admin/orders");
export const getAdminOrderDetails = (id) => api.get(`/admin/orders/${id}`);
export const updateAdminOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status });

// =========================
// USER ORDER APIs
// =========================
export const createUserOrder = (data) => api.post("/orders", data);
export const getUserOrders = () => api.get("/orders/my-orders");

export default api;
