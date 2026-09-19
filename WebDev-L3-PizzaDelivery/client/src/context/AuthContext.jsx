import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // RESTORE AUTH STATE
  // =========================
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("pizzahub_token");
      const savedUser = localStorage.getItem("pizzahub_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Auth restore error:", error);
      localStorage.removeItem("pizzahub_token");
      localStorage.removeItem("pizzahub_user");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("pizzahub_token", authToken);
    localStorage.setItem("pizzahub_user", JSON.stringify(userData));
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pizzahub_token");
    localStorage.removeItem("pizzahub_user");
    navigate("/login");
  };

  // =========================
  // COMPUTED
  // =========================
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}

export default AuthContext;
