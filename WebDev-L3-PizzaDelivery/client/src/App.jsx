import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PizzaBuilder from "./pages/PizzaBuilder";
import OrderSummary from "./pages/OrderSummary";
import Orders from "./pages/Orders";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventory from "./pages/admin/Inventory";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ROUTES ================= */}

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
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/pizza-builder"
          element={<PizzaBuilder />}
        />

        <Route
          path="/order-summary"
          element={<OrderSummary />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/inventory"
          element={<Inventory />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;