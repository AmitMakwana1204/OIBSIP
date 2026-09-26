import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =========================================================
// AUTH
// =========================================================

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// =========================================================
// USER PAGES
// =========================================================

import Home from "./pages/Home";
import Profile from "./pages/Profile";
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
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist"; 

// =========================================================
// ADMIN PAGES
// =========================================================

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

          {/* =================================================
              PUBLIC ROUTES
          ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

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

          {/* =================================================
              USER PROTECTED ROUTES
          ================================================== */}

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Pizza Builder */}

          <Route
            path="/pizza-builder"
            element={
              <ProtectedRoute>
                <PizzaBuilder />
              </ProtectedRoute>
            }
          />

          {/* Order Summary */}

          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            }
          />

          {/* Orders */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Cart */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Wishlist */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Checkout */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Order Success */}

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ROUTES
          ================================================== */}

          {/* Admin Login */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Admin Dashboard */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* Admin Inventory */}

          <Route
            path="/admin/inventory"
            element={
              <AdminProtectedRoute>
                <Inventory />
              </AdminProtectedRoute>
            }
          />

          {/* Admin Orders */}

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />

          {/* Admin Ingredients */}

          <Route
            path="/admin/ingredients"
            element={
              <AdminProtectedRoute>
                <AdminIngredients />
              </AdminProtectedRoute>
            }
          />

          {/* Admin Menu / Pizzas */}

          <Route
            path="/admin/menu"
            element={
              <AdminProtectedRoute>
                <AdminPizzas />
              </AdminProtectedRoute>
            }
          />

          {/* =================================================
              404 / UNKNOWN ROUTE
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;