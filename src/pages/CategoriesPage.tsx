import { Camera, Code, Music, Palette, Pencil } from "lucide-react";
import React from "react";

const categories = [
  {
    name: "Art & Illustration",
    icon: Palette,
    count: 300,
    color: "bg-pink-500",
  },
  { name: "Photography", icon: Camera, color: "bg-purple-500" },
  { name: "Web Development", icon: Code, color: "bg-blue-500" },
  { name: "Music", icon: Music, color: "bg-green-500" },
  { name: "Design", icon: Pencil, color: "bg-indigo-500" },
];

const CategoryPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8  mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="mt-1 text-gray-600"></p>
      </div>

      <div className="grid px-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.name}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-600/10 to-cyan-500/10 transition-opacity duration-200" />

              <div className="relative p-6">
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {/* {category.count.toLocaleString()} projects */}
                </p>

                <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Lihat Semua →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
