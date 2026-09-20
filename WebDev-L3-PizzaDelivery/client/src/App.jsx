import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PizzaBuilder from "./pages/PizzaBuilder";
import OrderSummary from "./pages/OrderSummary";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import VerifyEmail from "./pages/VerifyEmail"; 

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventory from "./pages/admin/Inventory";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminIngredients from "./pages/admin/AdminIngredients"; 
import AdminPizzas from "./pages/admin/AdminPizzas";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
           path="/verify-email"
           element={<VerifyEmail />} 
          />

          {/* ================= PROTECTED USER ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pizza-builder"
            element={
              <ProtectedRoute>
                <PizzaBuilder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <AdminProtectedRoute>
                <Inventory />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/ingredients"
            element={
              <AdminProtectedRoute>
                <AdminIngredients />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminProtectedRoute>
                <AdminPizzas />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;