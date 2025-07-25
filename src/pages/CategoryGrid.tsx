import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryDetailPage";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://kreatifanabe-production.up.railway.app/api/categories"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data kategori");
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading kategori...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryGrid;
