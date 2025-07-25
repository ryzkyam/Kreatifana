// src/pages/FavoritePage.tsx

import { Heart, Info, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { formatPrice } from "../lib/utils";

import { Product } from "./ProductPage";

const BASE_BACKEND_URL = "https://kreatifanabe-production.up.railway.app";

const getFullImageUrl = (path: string | undefined | null) => {
  if (!path) {
    return "https://placehold.co/400x300/e0e0e0/505050?text=No+Image";
  }
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("//")
  ) {
    return path;
  }
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_BACKEND_URL}${cleanedPath}`;
};

const FavoritePage: React.FC = () => {
  const { favoriteItems, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Produk Favorit Anda
        </h1>

        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md text-gray-600">
            <Heart size={64} className="text-red-400 mb-4" />
            <p className="text-xl font-semibold mb-2">
              Belum ada produk favorit.
            </p>
            <p className="text-md text-center mb-4">
              Jelajahi produk kami dan tambahkan yang Anda suka ke favorit!
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {/* ✅ Perbaiki path di sini: /product/ bukan /products/ */}
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={getFullImageUrl(product.thumbnailUrl)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {/* ✅ Perbaiki path di sini: /product/ bukan /products/ */}
                    <Link
                      to={`/product/${product.slug}`}
                      className="hover:text-blue-600"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description || "Tidak ada deskripsi."}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center space-x-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.downloads?.toLocaleString() || "0"} unduhan
                      </span>
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {product.category.name}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-gray-900 mb-5">
                    {formatPrice(product.price)}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                      <span>Hapus</span>
                    </button>
                    {/* ✅ Perbaiki path di sini: /product/ bukan /products/ */}
                    <Link
                      to={`/product/${product.slug}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Info className="w-5 h-5" />
                      <span>Detail</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
