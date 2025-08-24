// src/context/AuthContext.tsx
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// --- Konfigurasi URL Backend ---
const BASE_BACKEND_URL_FROM_ENV =
  import.meta.env.VITE_APP_BACKEND_URL ||
  "https://kreatifanabe-production-0403.up.railway.app"; // Default fallback

// PENTING: Pastikan ini diekspor
export const API_BASE_URL = BASE_BACKEND_URL_FROM_ENV.endsWith("/")
  ? BASE_BACKEND_URL_FROM_ENV
  : `${BASE_BACKEND_URL_FROM_ENV}/`;

console.log("AuthContext: API_BASE_URL is", API_BASE_URL);

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  isAdmin: boolean;
}

interface AuthType {
  token: string | null;
  user: User | null;
}

interface AuthContextType {
  auth: AuthType;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthType>({ token: null, user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("📦 Token from localStorage on AuthProvider load:", token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("🔓 Decoded token on AuthProvider load:", decoded);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("⏰ Token expired on load.");
          localStorage.removeItem("authToken");
          setAuth({ token: null, user: null });
        } else {
          setAuth({
            token,
            user: {
              id: decoded.id,
              email: decoded.email,
              name: decoded.name,
              username: decoded.username,
              isAdmin: decoded.isAdmin,
            },
          });
        }
      } catch (err) {
        console.error("❌ Failed to decode token on load", err);
        localStorage.removeItem("authToken");
        setAuth({ token: null, user: null });
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/login`, {
        // Menggunakan API_BASE_URL
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("authToken", token);
        setAuth({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin,
          },
        });
        return { success: true };
      }
      return { success: false, message: "No token or user data in response." };
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/register`, // Menggunakan API_BASE_URL
        { name, username, email, password }
      );

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("authToken", token);

        setAuth({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin,
          },
        });
        return { success: true };
      }
      return { success: false, message: "No token or user data in response." };
    } catch (error: any) {
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({ token: null, user: null });
    console.log("User logged out. authToken removed.");
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PENTING: Pastikan ini diekspor
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
