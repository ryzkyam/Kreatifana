// src/pages/FavoriteContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";

// Import tipe Product dari ProductPage.tsx untuk konsistensi
// Pastikan path import ini sesuai dengan lokasi ProductPage.tsx Anda
import { Product } from "../pages/ProductPage";

// --- Tipe untuk Context Favorit ---
interface FavoriteContextType {
  favoriteItems: Product[]; // Daftar produk yang difavoritkan
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean; // Fungsi untuk memeriksa apakah produk sudah difavoritkan
}

// --- Membuat Context ---
const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

// --- Hook Kustom untuk Menggunakan Context Favorit ---
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};

// --- Provider Component Favorit ---
interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({
  children,
}) => {
  // State untuk menyimpan daftar produk favorit
  // Memuat dari Local Storage saat inisialisasi
  const [favoriteItems, setFavoriteItems] = useState<Product[]>(() => {
    try {
      const storedFavorites = localStorage.getItem("favoriteItems");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Failed to load favorite items from localStorage", error);
      return [];
    }
  });

  // Effect untuk menyimpan ke Local Storage setiap kali favoriteItems berubah
  useEffect(() => {
    try {
      localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    } catch (error) {
      console.error("Failed to save favorite items to localStorage", error);
    }
  }, [favoriteItems]);

  // --- Fungsi untuk Menambah Produk ke Favorit ---
  const addFavorite = (product: Product) => {
    setFavoriteItems((prevItems) => {
      // Periksa apakah produk sudah ada di favorit
      if (!prevItems.some((item) => item.id === product.id)) {
        toast.success(`${product.title} ditambahkan ke favorit!`);
        return [...prevItems, product];
      }
      toast("Produk ini sudah ada di favorit.", { icon: "ℹ️" });
      return prevItems; // Jika sudah ada, kembalikan array sebelumnya
    });
  };

  // --- Fungsi untuk Menghapus Produk dari Favorit ---
  const removeFavorite = (productId: string) => {
    setFavoriteItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      // Hanya tampilkan toast jika item benar-benar dihapus
      if (updatedItems.length < prevItems.length) {
        toast.success("Produk dihapus dari favorit.");
      }
      return updatedItems;
    });
  };

  // --- Fungsi untuk Memeriksa Apakah Suatu Produk Sudah Ada di Favorit ---
  const isFavorite = (productId: string): boolean => {
    return favoriteItems.some((item) => item.id === productId);
  };

  const contextValue = {
    favoriteItems,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};