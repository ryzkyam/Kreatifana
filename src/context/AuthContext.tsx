// src/contexts/AuthContext.tsx

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react"; // Pastikan semua import ada

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  isAdmin: boolean;
  // Jika Anda akan menambahkan avatar/products lagi di masa depan, tambahkan di sini:
  // avatar?: string | null;
  // products?: Product[];
}

// Jika Anda akan menambahkan Product interface lagi, definisikan di sini
// interface Product {
//   id: string;
//   title: string;
//   thumbnailUrl?: string | null;
//   // ...
// }

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextType {
  auth: AuthState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  // Jika Anda menambahkan getFullImageUrl ke context, tambahkan di sini:
  // getFullImageUrl: (path: string | undefined | null) => string;
}

// --- MODIFIKASI INI ---
// Deklarasikan context itu sendiri
const AuthContext = createContext<AuthContextType | undefined>(undefined); // Ubah default value ke undefined

// --- MODIFIKASI INI ---
// Buat custom hook useAuth sebagai fungsi terpisah
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- SISANYA TETAP SAMA (PROVIDER) ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("📦 Token from localStorage on load:", token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("🔓 Decoded token:", decoded);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("⏰ Token expired.");
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
        console.error("❌ Failed to decode token", err);
        localStorage.removeItem("authToken");
        setAuth({ token: null, user: null });
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        "https://kreatifanabe-production.up.railway.app/api/auth/login",
        { email, password }
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

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "https://kreatifanabe-production.up.railway.app/api/auth/register",
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

        return true;
      }

      return false;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
