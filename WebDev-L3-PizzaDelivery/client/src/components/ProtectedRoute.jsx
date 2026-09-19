import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while restoring auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={40}
            className="text-red-600 animate-spin"
          />
          <p className="text-gray-500 font-bold text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
