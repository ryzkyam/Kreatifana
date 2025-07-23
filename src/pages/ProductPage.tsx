// src/pages/ProductPage.tsx
import {
  Calendar,
  Check,
  Download,
  ExternalLink,
  Heart,
  ShoppingCart,
  Star,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatPrice } from "../lib/utils";

import { useCart } from "../context/CartContext";
// ✅ IMPORT useFavorites DARI CONTEXT FAVORIT ANDA
import { useFavorites } from "../context/FavoriteContext"; // PASTIKAN PATH INI SESUAI

// --- Fungsi Pembantu untuk Gambar ---
const BASE_BACKEND_URL = "http://localhost:3000"; // Sesuaikan dengan URL server Express Anda

const getFullImageUrl = (path: string | undefined | null) => {
  if (!path) {
    return "https://placehold.co/800x600/e0e0e0/505050?text=No+Image";
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

// --- DEFINISI TIPE PRODUCT FEATURE ---
interface ProductFeature {
  id: string;
  text: string;
  description?: string;
  iconUrl?: string;
}

// --- DEFINISI TIPE PRODUCT (Pastikan ini sesuai dengan respons API Anda) ---
export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number | null;
  thumbnailUrl: string;
  demoUrl?: string | null;
  downloads?: number;

  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  }>;
  features?: ProductFeature[];
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  location?: string;
  portfolio?: string;
  products?: Product[];
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const { cartItems, addItem } = useCart();
  // ✅ DAPATKAN FUNGSI-FUNGSI DARI useFavorites
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // --- PASTIKAN DEKLARASI STATE BERIKUT ADA DI SINI, DI AWAL KOMPONEN ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ state isFavorited akan diset dari context
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInCart, setIsInCart] = useState(false); // ✅ DEKLARASI INI HARUS DI SINI

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittedReviews, setSubmittedReviews] = useState<any[]>([]);

  // --- useEffect untuk mengambil data produk dari API ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers: HeadersInit = {};
        if (auth?.token) {
          headers["Authorization"] = `Bearer ${auth.token}`;
        }

        const response = await fetch(
          `${BASE_BACKEND_URL}/api/products/slug/${slug}`,
          { headers }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Produk tidak ditemukan.");
          }
          const errorData = await response.json();
          throw new Error(
            `Gagal mengambil data produk: ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        setProduct(data.product);

        // ✅ Sekarang setIsInCart sudah terdefinisi dan bisa digunakan
        const productInCart = cartItems.some(
          (item) => item.product.id === data.product.id
        );
        setIsInCart(productInCart);

        // ✅ SET STATUS isFavorited DARI CONTEXT
        if (data.product && data.product.id) {
          setIsFavorited(isFavorite(data.product.id));
        }

      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
    // ✅ Tambahkan cartItems dan isFavorite sebagai dependensi
  }, [slug, auth?.token, cartItems, isFavorite]); // ✅ Tambahkan isFavorite di sini!

  // Ini akan menentukan isInCart dan isFavorited setiap kali product, cartItems, atau favoriteItems berubah
  // Anda bisa menggabungkan ini dengan useEffect di atas atau memisahkannya jika logikanya kompleks
  useEffect(() => {
    if (product) {
      const productExistsInCart = cartItems.some(
        (item) => item.product.id === product.id
      );
      setIsInCart(productExistsInCart);
      
      // ✅ Perbarui isFavorited jika product atau favoriteItems dari context berubah
      setIsFavorited(isFavorite(product.id));
    }
  }, [product, cartItems, isFavorite]); // ✅ Tambahkan isFavorite

  const allReviews = product?.reviews
    ? [...submittedReviews, ...product.reviews]
    : submittedReviews;
  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;

  // ✅ KOREKSI FUNGSI handleToggleFavorite
  const handleToggleFavorite = () => {
    if (!product) return; // Pastikan produk ada

    if (isFavorited) { // Jika sudah favorit, hapus
      removeFavorite(product.id);
      // setIsFavorited(false); // Tidak perlu manual, useEffect di atas akan mengupdate
    } else { // Jika belum favorit, tambahkan
      addFavorite(product);
      // setIsFavorited(true); // Tidak perlu manual, useEffect di atas akan mengupdate
    }
    // Notifikasi toast sudah ditangani di FavoriteContext, jadi dihapus dari sini.
    // Anda bisa mengaktifkan lagi jika ingin toast tambahan di sini.
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      // toast.success(`${product.title} berhasil ditambahkan ke keranjang!`); // Toast sudah di handle di CartContext
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.trim() || newRating < 1 || newRating > 5) {
      toast.error("Ulasan dan rating tidak valid.");
      return;
    }
    const review = {
      id: Date.now().toString(),
      rating: newRating,
      comment: newReview,
      createdAt: new Date().toISOString(),
      user: {
        id: auth?.user?.id || "temp-user",
        name: auth?.user?.name || "Pengguna Saat Ini",
        avatar:
          auth?.user?.avatar ||
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      },
    };
    setSubmittedReviews((prev) => [review, ...prev]);
    setNewReview("");
    setNewRating(5);
    toast.success("Ulasan Anda berhasil dikirim! (Simulasi)");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Produk tidak ditemukan.</p>
      </div>
    );
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm flex items-center space-x-2 text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                to={`/category/${product.category.slug}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gambar Produk & Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={getFullImageUrl(product.thumbnailUrl)}
                  alt={product.title}
                  className="w-full h-auto object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/800x600/e0e0e0/505050?text=Image+Load+Error";
                    e.currentTarget.onerror = null;
                    console.error(
                      `ProductPage (${
                        product.title
                      }): Failed to load image from ${getFullImageUrl(
                        product.thumbnailUrl
                      )}`
                    );
                  }}
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    Hemat {discountPercentage}%
                  </div>
                )}
              </div>
            </div>

            {/* Bagian Tentang Produk, Fitur, dan Tags */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Tentang Produk</h2>
              <p className="text-gray-700 mb-6">
                {product.description || "Tidak ada deskripsi yang tersedia."}
              </p>

              {/* Fitur Utama */}
              {product.features && product.features.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-3">Fitur Utama</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {product.features.map(
                      (feature: ProductFeature, index: number) => (
                        <li
                          key={feature.id || index}
                          className="flex items-start"
                        >
                          <Check
                            size={18}
                            className="text-green-500 mr-2 flex-shrink-0 mt-1"
                          />
                          <div>
                            <span className="font-medium">{feature.text}</span>
                            {feature.description && (
                              <p className="text-sm text-gray-600">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-gray-500 text-sm mb-6">
                  Tidak ada fitur yang dicantumkan.
                </p>
              )}

              <h3 className="text-xl font-semibold mb-3">Tag</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Tidak ada tag.</span>
                )}
              </div>
            </div>

            {/* Bagian Ulasan */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Ulasan</h2>
                <span className="flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <Star size={16} className="fill-yellow-500 mr-1" />
                  {averageRating.toFixed(1)} ({allReviews.length})
                </span>
              </div>

              {allReviews.length > 0 ? (
                allReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 py-4 last:border-0"
                  >
                    <div className="flex items-start mb-2">
                      <img
                        src={
                          review.user?.avatar ||
                          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                        }
                        alt={review.user?.name || "Pengguna"}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">
                          {review.user?.name || "Pengguna Anonim"}
                        </h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-gray-700">{review.comment}</p>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Belum ada ulasan untuk produk ini.
                </p>
              )}

              {/* Form Ulasan */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Tulis Ulasan</h3>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Tulis pendapat Anda..."
                  className="w-full p-3 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={4}
                />
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-sm">Rating:</span>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Star
                      key={num}
                      size={20}
                      className={`cursor-pointer ${
                        num <= newRating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => setNewRating(num)}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleSubmitReview}
                  disabled={!newReview.trim()}
                >
                  Kirim Ulasan
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(averageRating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({allReviews.length} ulasan)
                  </span>
                </div>

                <div className="flex items-baseline mb-6">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-blue-800">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-blue-800">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={isInCart}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    {isInCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleToggleFavorite} // Pastikan ini memanggil fungsi yang benar
                  >
                    <Heart
                      size={18}
                      className={`mr-2 ${
                        isFavorited ? "fill-red-500 text-red-500" : "" // Warna ikon berdasarkan state
                      }`}
                    />
                    {isFavorited ? "Tersimpan" : "Simpan ke Favorit"}
                  </Button>

                  {product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Lihat Demo Langsung
                    </a>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2" /> Kategori
                    </div>
                    {product.category && (
                      <Link to={`/category/${product.category.slug}`}>
                        {product.category.name}
                      </Link>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" /> Dirilis
                    </div>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Download size={16} className="mr-2" /> Unduhan
                    </div>
                    <span>{product.downloads?.toLocaleString() || "0"}</span>
                  </div>

                  {/* Profil Pengguna dengan Link dan Avatar */}
                  <Link
                    to={`/users/${product.user.username}`}
                    className="flex items-center space-x-2 pt-4 hover:underline"
                  >
                    <img
                      src={
                        product.user.avatar ||
                        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                      }
                      alt={product.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      by {product.user.name}
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;