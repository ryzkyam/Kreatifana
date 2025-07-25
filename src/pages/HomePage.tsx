// src/pages/HomePage.tsx
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react"; // Tambahkan useEffect
import { Link } from "react-router-dom";
import bgimage from "../assets/banner.png";
import ProductCard from "../components/ProductCard";
import Button from "../components/ui/Button";

// Definisikan ulang interface Product agar sesuai dengan struktur dari backend
// Sesuaikan ini jika struktur dari backend Anda sedikit berbeda
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number | null; // oldPrice bisa null jika tidak ada diskon
  thumbnailUrl: string;
  slug: string;
  fileUrl?: string | null; // Menambahkan fileUrl jika ada
  published?: boolean; // Menambahkan published jika ada
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
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
  features?: Array<{
    id: string;
    text: string;
    description?: string;
    iconUrl?: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  downloads?: number; // Menambahkan downloads jika ada
  isFavorited?: boolean; // Ini akan dihitung di frontend
}

// Mock data categories (bisa tetap pakai ini atau fetch dari backend juga)
const categories = [
  {
    id: "1",
    name: "Art/Illustration",
    slug: "ui-templates",
    image:
      "https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "2",
    name: "Web Development",
    slug: "icons",
    image:
      "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "3",
    name: "Design/Illustrations",
    slug: "illustrations",
    image:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "4",
    name: "Photography",
    slug: "fotography",
    image:
      "https://images.pexels.com/photos/196643/pexels-photo-196643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]); // State untuk produk dari backend
  const [loadingProducts, setLoadingProducts] = useState(true); // Loading state
  const [errorProducts, setErrorProducts] = useState<string | null>(null); // Error state
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]); // State untuk melacak produk favorit (ini biasanya dari user data)

  // --- useEffect untuk Fetch Products dari Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setErrorProducts(null);
        // Pastikan URL ini sesuai dengan endpoint backend Anda
        const response = await fetch(
          "https://kreatifanabe-production.up.railway.app/api/products"
        );

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data produk: ${response.statusText}`
          );
        }

        const data = await response.json();
        // Asumsi API mengembalikan { success: true, products: [] }
        // Kita tambahkan properti isFavorited berdasarkan state favorit
        const productsWithFavStatus = data.products.map((product: Product) => ({
          ...product,
          isFavorited: favoriteProducts.includes(product.id),
        }));
        setProducts(productsWithFavStatus);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setErrorProducts(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [favoriteProducts]); // Rerun effect jika daftar favorit berubah

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      console.log("Searching for:", searchQuery);
      // Contoh: navigate(`/search?q=${searchQuery}`);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteProducts((prevFavorites) => {
      const newFavorites = prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId];
      // Di aplikasi nyata, Anda akan mengirim permintaan ke backend untuk menyimpan status favorit ini
      console.log(
        `Product ${productId} favorit status updated to: ${newFavorites.includes(
          productId
        )}`
      );
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section
        className=" relative bg-cover bg-center text-white py-32 md:py-48 lg:py-40"
        style={{
          backgroundImage: `url(${bgimage})`,
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              🎨 Segala Kebutuhan Kreatifmu, dalam Satu Tempat
            </h1>
            <p
              className="text-lg md:text-xl text-gray-200 mb-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Dari fotografi, desain, musik, hingga UI/UX — temukan ribuan
              produk digital siap pakai untuk mendukung setiap karya dan
              proyekmu.
            </p>

            <form
              onSubmit={handleSearch}
              className="max-w-xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative mb-32"></div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16  relative z-10 bg-white -mt-32 rounded-t-3xl shadow-xl px-4 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Kategori Produk</h2>
            <Link
              to="/categories"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-soft h-40 transition-transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-200">
                    {category.count} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Sekarang dari Backend) */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Kumpulan Produk</h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {loadingProducts ? (
            <div>Loading products...</div>
          ) : errorProducts ? (
            <div>Error: {errorProducts}</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product} // Kirim seluruh objek produk
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div>Tidak ada produk yang tersedia.</div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Siap untuk menampilkan karyamu?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Bergabunglah dengan komunitas kreator kami dan jual produk
              digitalmu ke ribuan pelanggan di seluruh dunia.
            </p>
            <Button variant="primary" size="lg">
              <a href="/jadikreator">Daftar jadi Kreator</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
