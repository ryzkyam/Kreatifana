import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  thumbnailUrl: string;
  slug: string;
  user: { name: string; id: string; avatar: string | null };
  category: { id: string; name: string; slug: string };
}

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://kreatifanabe-production-0403.up.railway.app/api/products"
        );

        if (!response.ok) throw new Error("Gagal memuat produk");

        const data = await response.json();

        const filtered = data.products.filter(
          (product: Product) => product.category.slug === slug
        );

        setProducts(filtered);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 capitalize">{slug}</h1>
      {loading && <p>Loading produk...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && products.length === 0 && <p>Tidak ada produk ditemukan.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
