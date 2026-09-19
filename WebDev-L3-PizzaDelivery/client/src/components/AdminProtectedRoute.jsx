import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("pizzahub_admin_token");
  let adminUser = null;

  try {
    const rawUser = localStorage.getItem("pizzahub_admin_user");
    if (rawUser) {
      adminUser = JSON.parse(rawUser);
    }
  } catch (e) {
    adminUser = null;
  }

  const isAdminAuthenticated = Boolean(adminToken && adminUser && adminUser.role === "admin");

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
