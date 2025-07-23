// src/AppRoutes.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

// Pages
import Cart from "./pages/Cart";
import CategoryPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import AdminDashboard from "./pages/DashboardAdmin";
import HomePage from "./pages/HomePage";
import JadiKreatorPage from "./pages/JadiKreator";
import LoginPage from "./pages/LoginPage";
import MyProfilePage from "./pages/MyProfilePage";
import PortfolioManagement from "./pages/PortofolioManagement";
import ProductPage from "./pages/ProductPage";
import UserProfile from "./pages/ProfilDetail";
import Signupform from "./pages/SignupPage";
import TrendingPage from "./pages/TrendingPage";

// ✅ Import Context Providers dari folder 'context'
import { CartProvider } from "./context/CartContext"; // KOREKSI PATH INI
import { FavoriteProvider } from "./context/FavoriteContext";

// Import Halaman Favorit
import FavoritePage from "./pages/FavoritePage";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        <span className="ml-4 text-lg font-medium">Loading user...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <FavoriteProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/Signupform" element={<Signupform />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/trendings" element={<TrendingPage />} />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/favorites" element={<FavoritePage />} />
              <Route path="/portof" element={<PortfolioManagement />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route
                path="/users/:username"
                element={<ProtectedRoute element={<UserProfile />} />}
              />
              <Route path="/profile/:username" element={<MyProfilePage />} />
              <Route path="/category/:slug" element={<CategoryDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/jadikreator" element={<JadiKreatorPage />} />
            </Routes>
          </CartProvider>
        </FavoriteProvider>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
