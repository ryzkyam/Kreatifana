// src/components/ProductCard.tsx
import { Heart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

// Definisikan interface untuk struktur produk yang diharapkan dari backend
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number; // Opsional, jika ada diskon
  thumbnailUrl: string; // Pastikan ini string, bukan null atau undefined saat diterima
  slug: string;
  user: { name: string };
  category: { name: string };
  isFavorited?: boolean; // Opsional, jika Anda ingin melacak favorit di frontend
}

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: string) => void; // Opsional, untuk fitur favorit
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleFavorite,
}) => {
  const {
    id,
    title,
    price,
    oldPrice,
    thumbnailUrl, // Kita akan menggunakan ini
    slug,
    user,
    category,
    isFavorited,
  } = product;

  // --- START PERBAIKAN DI SINI ---
  // Definisikan base URL backend kamu.
  // PENTING: Ganti "http://localhost:3000" dengan URL server Express kamu yang sebenarnya.
  const BASE_BACKEND_URL = "https://kreatifanabe-production.up.railway.app";

  // ✅ Perbaikan: Fungsi pembantu untuk membuat URL gambar lengkap
  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) {
      return "https://placehold.co/400x300/e0e0e0/505050?text=No+Image"; // Placeholder default
    }
    // Jika path sudah berupa URL absolut, langsung gunakan
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("//")
    ) {
      return path;
    }
    // Jika path belum memiliki leading slash, tambahkan
    const cleanedPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_BACKEND_URL}${cleanedPath}`;
  };

  // Gunakan fungsi pembantu ini untuk membuat URL gambar
  const fullImageUrl = getFullImageUrl(thumbnailUrl);

  // ✅ DEBUGGING: Log URL gambar yang akan dimuat
  console.log(
    `ProductCard (${title}): Attempting to load image from: ${fullImageUrl}`
  );

  // --- END PERBAIKAN DI SINI ---

  // Hitung diskon dalam persen
  const discountPercentage =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <Link
      to={`/product/${slug}`}
      className="block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img
          // Gunakan fullImageUrl di sini agar browser bisa menemukan gambarnya
          src={fullImageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          // Opsional: Tambahkan penanganan error jika gambar tidak dapat dimuat
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x300/e0e0e0/505050?text=Image+Load+Error";
            e.currentTarget.onerror = null; // Menghindari looping error
            console.error(
              `ProductCard (${title}): Failed to load image from ${fullImageUrl}`
            ); // Log error gambar
          }}
        />
        {discountPercentage && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault(); // Mencegah navigasi saat klik hati
              onToggleFavorite(id);
            }}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md focus:outline-none"
          >
            <Heart
              size={20}
              className={
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
              }
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{category.name}</p>
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {user.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {oldPrice && oldPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                Rp {oldPrice.toLocaleString("id-ID")}
              </span>
            )}
            <span className="text-xl font-bold text-primary-600">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
